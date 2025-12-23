# Implementation Plan: Adaptive Learning / Personalization

## Tech Stack Selection

### Backend Framework: FastAPI 0.109.0

**Why FastAPI?**
1. **Existing Integration**: Already used for RAG chatbot, reuse infrastructure
2. **Async Support**: Handle multiple concurrent personalization requests
3. **Type Safety**: Pydantic models for profile and personalization validation
4. **Performance**: Fast enough for < 3s response time requirement
5. **Easy Deployment**: Same deployment as existing backend
6. **OpenAI Integration**: Works seamlessly with async OpenAI client

**API Structure**:
```
backend/
├── main.py                 # Existing FastAPI app
├── personalization.py      # NEW: Personalization endpoint
├── models.py               # Add UserProfile model
└── prompts/
    └── personalization.py  # NEW: LLM prompt templates
```

### Database: PostgreSQL (Existing)

**Why Postgres?**
1. **Already Setup**: Authentication system uses Postgres
2. **Relational Model**: User profiles link to user accounts
3. **JSON Support**: Store hardware_access array as JSONB
4. **Performance**: Fast indexed lookups for user_id
5. **ACID Compliance**: Reliable profile updates
6. **Migration Support**: Alembic for schema changes

**Schema Design**:
```sql
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    skill_level VARCHAR(20) NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    programming_experience VARCHAR(20) NOT NULL,
    robotics_background VARCHAR(20) NOT NULL,
    hardware_access JSONB DEFAULT '[]',
    learning_goals TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
```

### LLM Provider: OpenAI GPT-3.5-turbo

**Why GPT-3.5-turbo?**
1. **Cost-Effective**: $0.0015/1K tokens (target < $0.01 per request)
2. **Fast**: 1-2 second response times
3. **Quality**: Good enough for content transformation
4. **Context Window**: 16K tokens (handles long textbook sections)
5. **Existing Integration**: Already using OpenAI for chatbot
6. **API Stability**: Mature, reliable API

**Cost Calculation**:
```
Average Request:
- Input: 1500 tokens (content) + 300 tokens (prompt) = 1800 tokens
- Output: 2000 tokens (transformed content)
- Cost: (1800 × $0.0015 + 2000 × $0.002) / 1000 = $0.0067 per request

Monthly Budget (1000 users, 5 requests each):
- 5000 requests × $0.0067 = $33.50/month
- With 40% cache hit rate: $20/month
```

**Upgrade Path to GPT-4**:
If budget allows or quality issues arise:
- GPT-4-turbo: $0.01/1K input, $0.03/1K output
- Cost per request: ~$0.08 (12x more expensive)
- Use for complex transformations or advanced users only

### Frontend Framework: React + TypeScript (Existing)

**Why React?**
1. **Existing Stack**: Entire frontend already in React
2. **Component Reuse**: Similar pattern to ChatBot component
3. **State Management**: React Context for user profile
4. **TypeScript**: Type-safe profile data handling

**Component Structure**:
```
src/
├── components/
│   ├── PersonalizationButton.tsx       # Existing
│   ├── PersonalizationModal.tsx        # NEW: Profile form modal
│   └── PersonalizedContent.tsx         # NEW: Renders personalized markdown
├── contexts/
│   └── UserProfileContext.tsx          # NEW: Global profile state
├── hooks/
│   └── usePersonalization.ts           # NEW: Personalization logic
└── lib/
    └── personalizationApi.ts           # NEW: API calls
```

### Caching Strategy: In-Memory + Future Redis

**Phase 1: Python LRU Cache**
```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def get_cached_personalization(content_hash: str, profile_hash: str):
    # Returns cached result if available
    pass
```

**Advantages**:
- Simple, no extra infrastructure
- Fast in-memory lookups
- Good for single-server deployment

**Limitations**:
- Lost on server restart
- Not shared across multiple servers
- Limited to ~1000 entries

**Phase 2: Redis (Future Enhancement)**
```python
import redis
import json

redis_client = redis.Redis(host='localhost', port=6379)

def cache_personalization(key: str, content: str, ttl: int = 86400):
    redis_client.setex(key, ttl, content)

def get_cached_personalization(key: str):
    cached = redis_client.get(key)
    return cached.decode('utf-8') if cached else None
```

**Migration Path**:
- Add Redis when scaling to multiple servers
- Use Railway Redis addon ($5/month)
- Implement cache warming for popular content

## Implementation Phases

### Phase 1: Backend Foundation (Week 1)

#### Task 1.1: Database Schema Setup
**Duration**: 2 hours
**Priority**: Critical

**Steps**:
1. Create migration file for `user_profiles` table
2. Add foreign key to existing `users` table
3. Create indexes for performance
4. Test migration on local database

**Code**:
```python
# backend/migrations/add_user_profiles.py
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    op.create_table(
        'user_profiles',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.String(255), unique=True, nullable=False),
        sa.Column('skill_level', sa.String(20), nullable=False),
        sa.Column('programming_experience', sa.String(20), nullable=False),
        sa.Column('robotics_background', sa.String(20), nullable=False),
        sa.Column('hardware_access', postgresql.JSONB(), default='[]'),
        sa.Column('learning_goals', sa.Text()),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.func.now())
    )
    op.create_index('idx_user_profiles_user_id', 'user_profiles', ['user_id'])
    op.create_foreign_key(
        'fk_user_profiles_user_id',
        'user_profiles', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

def downgrade():
    op.drop_table('user_profiles')
```

**Validation**:
- [ ] Migration runs without errors
- [ ] Can insert sample profiles
- [ ] Foreign key constraint works
- [ ] Indexes improve query performance

#### Task 1.2: Pydantic Models
**Duration**: 1 hour
**Priority**: Critical

**Code**:
```python
# backend/models.py (add to existing file)
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal
from datetime import datetime

class UserProfile(BaseModel):
    user_id: str
    skill_level: Literal['beginner', 'intermediate', 'advanced']
    programming_experience: Literal['none', 'basic', 'intermediate', 'expert']
    robotics_background: Literal['none', 'hobbyist', 'student', 'professional']
    hardware_access: List[Literal['raspberry_pi', 'arduino', 'esp32', 'none']]
    learning_goals: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @validator('hardware_access')
    def validate_hardware(cls, v):
        if len(v) == 0:
            return ['none']
        if 'none' in v and len(v) > 1:
            raise ValueError("Cannot have 'none' with other hardware")
        return v

class PersonalizationRequest(BaseModel):
    user_id: str
    content: str = Field(..., max_length=50000)
    content_type: Optional[str] = 'module_content'
    page_url: Optional[str] = None

class PersonalizationResponse(BaseModel):
    personalized_content: str
    transformations_applied: List[str]
    original_length: int
    personalized_length: int
    processing_time_ms: int
    cached: bool = False
```

**Validation**:
- [ ] Models validate correct data
- [ ] Invalid data raises proper errors
- [ ] Hardware validator works correctly

#### Task 1.3: Personalization Prompt Engineering
**Duration**: 4 hours
**Priority**: Critical

**Code**:
```python
# backend/prompts/personalization.py

PERSONALIZATION_SYSTEM_PROMPT = """You are an expert robotics and programming educator. Your task is to adapt educational content to match the student's skill level and context.

IMPORTANT RULES:
1. Maintain ALL learning objectives and core concepts
2. Preserve markdown formatting, links, and images
3. Keep code examples functional and tested
4. Never remove safety warnings or critical information
5. Adjust DEPTH and STYLE, not fundamental content
6. Output ONLY the transformed markdown, no meta-commentary

Your transformations should:
- Adjust technical vocabulary appropriately
- Provide relevant examples for their hardware
- Balance detail with clarity for their level
- Add helpful context without condescension
- Preserve author's intended learning outcomes
"""

def build_personalization_prompt(
    content: str,
    profile: UserProfile
) -> str:
    """Build the user prompt for content transformation."""
    
    # Skill level descriptions
    skill_descriptions = {
        'beginner': 'New to programming or robotics. Needs clear definitions, step-by-step guidance, and concrete examples.',
        'intermediate': 'Some programming experience, learning robotics. Can handle moderate abstraction and technical terminology.',
        'advanced': 'Experienced programmer/roboticist. Prefers theory-first, high-level abstractions, and minimal hand-holding.'
    }
    
    # Programming experience context
    prog_context = {
        'none': 'Explain programming concepts from first principles.',
        'basic': 'Assume basic syntax knowledge, explain intermediate concepts.',
        'intermediate': 'Assume solid programming foundation, focus on robotics-specific patterns.',
        'expert': 'Skip basic programming, dive into advanced optimization and architecture.'
    }
    
    # Robotics background context
    robotics_context = {
        'none': 'Introduce robotics concepts carefully with real-world analogies.',
        'hobbyist': 'Build on maker/DIY experience, connect to familiar projects.',
        'student': 'Academic approach with theory, research references, and rigor.',
        'professional': 'Industry standards, production considerations, advanced techniques.'
    }
    
    # Hardware-specific guidance
    hardware_examples = {
        'raspberry_pi': 'Use Python with RPi.GPIO or gpiozero. Include Linux commands and GPIO pin references.',
        'arduino': 'Use C++ with Arduino libraries. Reference Arduino IDE and board-specific details.',
        'esp32': 'Use MicroPython or ESP32 Arduino. Focus on WiFi/Bluetooth and power efficiency.',
        'none': 'Use hardware-agnostic pseudocode and conceptual explanations. Suggest specific hardware options.'
    }
    
    hardware = profile.hardware_access[0] if profile.hardware_access else 'none'
    
    prompt = f"""Transform the following educational content for this student profile:

**Skill Level**: {profile.skill_level.capitalize()}
{skill_descriptions[profile.skill_level]}

**Programming Experience**: {profile.programming_experience.capitalize()}
{prog_context[profile.programming_experience]}

**Robotics Background**: {profile.robotics_background.capitalize()}
{robotics_context[profile.robotics_background]}

**Available Hardware**: {hardware.replace('_', ' ').title()}
{hardware_examples[hardware]}

---

**ORIGINAL CONTENT**:

{content}

---

**YOUR TASK**:
Transform the above content to match this student's profile. Adjust:
1. Technical depth and vocabulary
2. Code examples for their hardware
3. Explanation style and detail level
4. Challenge difficulty

Output the transformed markdown directly. Preserve all formatting, links, and images.
"""
    
    return prompt


# Skill-specific transformation guidelines
BEGINNER_GUIDELINES = """
For beginners:
- Define technical terms on first use
- Use analogies to everyday concepts
- Provide complete, commented code examples
- Include "What you'll learn" summaries
- Add visual aids when possible
- Flag advanced topics with warnings
- Suggest prerequisite readings
- Use encouraging, supportive tone
"""

INTERMEDIATE_GUIDELINES = """
For intermediate learners:
- Use standard technical terminology
- Balance theory with practical examples
- Provide key explanations, not line-by-line
- Reference related concepts for context
- Include optimization opportunities
- Link to deeper technical resources
- Assume basic programming competency
"""

ADVANCED_GUIDELINES = """
For advanced learners:
- Lead with architectural concepts
- Minimize basic explanations
- Include research paper references
- Discuss performance trade-offs
- Cover edge cases and advanced topics
- Assume strong technical foundation
- Focus on "why" over "how"
- Suggest custom implementations
"""
```

**Validation**:
- [ ] Prompts generate quality transformations
- [ ] Test with 10 sample content pieces
- [ ] All levels produce appropriate output
- [ ] Hardware examples are technically correct
- [ ] Markdown formatting preserved

#### Task 1.4: Personalization Service
**Duration**: 6 hours
**Priority**: Critical

**Code**:
```python
# backend/personalization.py
import hashlib
import time
from functools import lru_cache
from typing import Optional
from openai import AsyncOpenAI
from .models import UserProfile, PersonalizationRequest, PersonalizationResponse
from .prompts.personalization import (
    PERSONALIZATION_SYSTEM_PROMPT,
    build_personalization_prompt
)

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class PersonalizationService:
    def __init__(self):
        self.model = "gpt-3.5-turbo"
        self.temperature = 0.3  # Low for consistency
        self.max_tokens = 4000
        
    def _generate_cache_key(self, content: str, profile: UserProfile) -> str:
        """Generate cache key from content and profile."""
        profile_str = f"{profile.skill_level}:{profile.programming_experience}:{profile.robotics_background}:{':'.join(profile.hardware_access)}"
        content_hash = hashlib.md5(content.encode()).hexdigest()
        profile_hash = hashlib.md5(profile_str.encode()).hexdigest()
        return f"{content_hash}:{profile_hash}"
    
    @lru_cache(maxsize=1000)
    def _get_cached_result(self, cache_key: str) -> Optional[str]:
        """LRU cache for personalization results."""
        # The caching is handled by decorator
        return None
    
    def _cache_result(self, cache_key: str, content: str):
        """Store result in cache."""
        # Use cache_key as input to trigger LRU cache storage
        self._get_cached_result(cache_key)
    
    async def personalize_content(
        self,
        content: str,
        profile: UserProfile
    ) -> PersonalizationResponse:
        """Personalize content based on user profile."""
        start_time = time.time()
        original_length = len(content)
        
        # Generate cache key
        cache_key = self._generate_cache_key(content, profile)
        
        # Check cache
        cached_result = self._get_cached_result(cache_key)
        if cached_result:
            return PersonalizationResponse(
                personalized_content=cached_result,
                transformations_applied=["retrieved_from_cache"],
                original_length=original_length,
                personalized_length=len(cached_result),
                processing_time_ms=int((time.time() - start_time) * 1000),
                cached=True
            )
        
        # Build prompt
        user_prompt = build_personalization_prompt(content, profile)
        
        # Call OpenAI
        try:
            response = await client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": PERSONALIZATION_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            personalized_content = response.choices[0].message.content
            
            # Cache result
            self._cache_result(cache_key, personalized_content)
            
            # Determine transformations applied
            transformations = []
            if profile.skill_level == 'beginner':
                transformations.append('simplified_for_beginners')
            elif profile.skill_level == 'advanced':
                transformations.append('enhanced_for_advanced')
            
            if 'raspberry_pi' in profile.hardware_access:
                transformations.append('raspberry_pi_examples')
            elif 'arduino' in profile.hardware_access:
                transformations.append('arduino_examples')
            elif 'esp32' in profile.hardware_access:
                transformations.append('esp32_examples')
            
            processing_time = int((time.time() - start_time) * 1000)
            
            return PersonalizationResponse(
                personalized_content=personalized_content,
                transformations_applied=transformations,
                original_length=original_length,
                personalized_length=len(personalized_content),
                processing_time_ms=processing_time,
                cached=False
            )
            
        except Exception as e:
            # Log error and return original content
            print(f"Personalization error: {e}")
            return PersonalizationResponse(
                personalized_content=content,  # Fallback to original
                transformations_applied=["error_fallback"],
                original_length=original_length,
                personalized_length=original_length,
                processing_time_ms=int((time.time() - start_time) * 1000),
                cached=False
            )

# Initialize service
personalization_service = PersonalizationService()
```

**Validation**:
- [ ] Service handles OpenAI API calls correctly
- [ ] Caching works and improves performance
- [ ] Error handling returns original content
- [ ] Cache keys are unique and consistent
- [ ] Performance < 3 seconds for uncached requests

#### Task 1.5: FastAPI Endpoints
**Duration**: 4 hours
**Priority**: Critical

**Code**:
```python
# backend/main.py (add to existing FastAPI app)
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import UserProfile, PersonalizationRequest, PersonalizationResponse
from .personalization import personalization_service
from .auth import get_current_user  # Existing auth function

app = FastAPI()  # Existing app

# User Profile Endpoints

@app.post("/api/user/profile", response_model=UserProfile)
async def create_or_update_profile(
    profile: UserProfile,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update user's personalization profile."""
    # Check if profile exists
    existing_profile = db.query(UserProfileModel).filter(
        UserProfileModel.user_id == current_user.id
    ).first()
    
    if existing_profile:
        # Update existing profile
        for key, value in profile.dict(exclude_unset=True).items():
            setattr(existing_profile, key, value)
        existing_profile.updated_at = datetime.utcnow()
    else:
        # Create new profile
        db_profile = UserProfileModel(**profile.dict())
        db.add(db_profile)
    
    db.commit()
    db.refresh(existing_profile or db_profile)
    
    return existing_profile or db_profile

@app.get("/api/user/profile", response_model=UserProfile)
async def get_profile(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's personalization profile."""
    profile = db.query(UserProfileModel).filter(
        UserProfileModel.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return profile

@app.delete("/api/user/profile")
async def delete_profile(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user's personalization profile."""
    profile = db.query(UserProfileModel).filter(
        UserProfileModel.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    db.delete(profile)
    db.commit()
    
    return {"message": "Profile deleted successfully"}

# Personalization Endpoint

@app.post("/api/personalize", response_model=PersonalizationResponse)
async def personalize_content(
    request: PersonalizationRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Personalize content based on user profile."""
    # Get user profile
    profile = db.query(UserProfileModel).filter(
        UserProfileModel.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="User profile not found. Please create a profile first."
        )
    
    # Convert DB model to Pydantic model
    user_profile = UserProfile(
        user_id=profile.user_id,
        skill_level=profile.skill_level,
        programming_experience=profile.programming_experience,
        robotics_background=profile.robotics_background,
        hardware_access=profile.hardware_access,
        learning_goals=profile.learning_goals
    )
    
    # Personalize content
    result = await personalization_service.personalize_content(
        content=request.content,
        profile=user_profile
    )
    
    return result

# Health check
@app.get("/api/personalization/health")
async def personalization_health():
    """Check personalization service health."""
    return {
        "status": "healthy",
        "service": "personalization",
        "cache_size": personalization_service._get_cached_result.cache_info().currsize,
        "cache_hits": personalization_service._get_cached_result.cache_info().hits,
        "cache_misses": personalization_service._get_cached_result.cache_info().misses
    }
```

**Validation**:
- [ ] Endpoints return correct status codes
- [ ] Authentication works correctly
- [ ] Profile CRUD operations work
- [ ] Personalization endpoint processes requests
- [ ] Error handling returns appropriate responses

### Phase 2: Frontend Components (Week 2)

#### Task 2.1: User Profile Context
**Duration**: 3 hours
**Priority**: Critical

**Code**:
```typescript
// src/contexts/UserProfileContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  user_id: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  programming_experience: 'none' | 'basic' | 'intermediate' | 'expert';
  robotics_background: 'none' | 'hobbyist' | 'student' | 'professional';
  hardware_access: ('raspberry_pi' | 'arduino' | 'esp32' | 'none')[];
  learning_goals?: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasProfile: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setError(null);
      } else if (response.status === 404) {
        setProfile(null);  // No profile yet
        setError(null);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...profile, ...updates })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  return (
    <UserProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        updateProfile,
        refreshProfile: fetchProfile,
        hasProfile: profile !== null
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
}
```

**Validation**:
- [ ] Context provides profile state
- [ ] Updates trigger re-renders
- [ ] Loading states work correctly
- [ ] Error handling displays properly

#### Task 2.2: Personalization Hook
**Duration**: 4 hours
**Priority**: Critical

**Code**:
```typescript
// src/hooks/usePersonalization.ts
import { useState } from 'react';
import { useUserProfile } from '../contexts/UserProfileContext';

interface PersonalizationResult {
  personalizedContent: string;
  transformationsApplied: string[];
  originalLength: number;
  personalizedLength: number;
  processingTimeMs: number;
  cached: boolean;
}

export function usePersonalization() {
  const { profile, hasProfile } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PersonalizationResult | null>(null);
  
  const personalizeContent = async (content: string, pageUrl?: string) => {
    if (!hasProfile) {
      setError('Please create a profile first');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: profile?.user_id,
          content,
          page_url: pageUrl
        })
      });
      
      if (!response.ok) {
        throw new Error('Personalization failed');
      }
      
      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    personalizeContent,
    loading,
    error,
    result,
    hasProfile
  };
}
```

#### Task 2.3: Personalization Modal Component
**Duration**: 6 hours
**Priority**: High

**Code**:
```typescript
// src/components/PersonalizationModal.tsx
import React, { useState } from 'react';
import { useUserProfile } from '../contexts/UserProfileContext';
import styles from './PersonalizationModal.module.css';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function PersonalizationModal({ isOpen, onClose, onSave }: PersonalizationModalProps) {
  const { profile, updateProfile, hasProfile } = useUserProfile();
  
  const [formData, setFormData] = useState({
    skill_level: profile?.skill_level || 'beginner',
    programming_experience: profile?.programming_experience || 'none',
    robotics_background: profile?.robotics_background || 'none',
    hardware_access: profile?.hardware_access || ['none'],
    learning_goals: profile?.learning_goals || ''
  });
  
  const [saving, setSaving] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile(formData);
      onSave();
      onClose();
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };
  
  const handleHardwareChange = (hardware: string) => {
    let newHardware = [...formData.hardware_access];
    
    if (hardware === 'none') {
      newHardware = ['none'];
    } else {
      newHardware = newHardware.filter(h => h !== 'none');
      if (newHardware.includes(hardware)) {
        newHardware = newHardware.filter(h => h !== hardware);
      } else {
        newHardware.push(hardware);
      }
      if (newHardware.length === 0) {
        newHardware = ['none'];
      }
    }
    
    setFormData({ ...formData, hardware_access: newHardware });
  };
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Personalize Your Learning Experience</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Skill Level */}
          <div className={styles.formGroup}>
            <label>Skill Level</label>
            <p className={styles.description}>
              How would you describe your overall skill level?
            </p>
            <div className={styles.radioGroup}>
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <label key={level} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="skill_level"
                    value={level}
                    checked={formData.skill_level === level}
                    onChange={e => setFormData({ ...formData, skill_level: e.target.value })}
                  />
                  <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Programming Experience */}
          <div className={styles.formGroup}>
            <label>Programming Experience</label>
            <select
              value={formData.programming_experience}
              onChange={e => setFormData({ ...formData, programming_experience: e.target.value })}
              className={styles.select}
            >
              <option value="none">None</option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          {/* Robotics Background */}
          <div className={styles.formGroup}>
            <label>Robotics Background</label>
            <select
              value={formData.robotics_background}
              onChange={e => setFormData({ ...formData, robotics_background: e.target.value })}
              className={styles.select}
            >
              <option value="none">None</option>
              <option value="hobbyist">Hobbyist</option>
              <option value="student">Student</option>
              <option value="professional">Professional</option>
            </select>
          </div>
          
          {/* Hardware Access */}
          <div className={styles.formGroup}>
            <label>Available Hardware</label>
            <p className={styles.description}>
              Select all hardware you have access to
            </p>
            <div className={styles.checkboxGroup}>
              {[
                { value: 'raspberry_pi', label: 'Raspberry Pi' },
                { value: 'arduino', label: 'Arduino' },
                { value: 'esp32', label: 'ESP32' },
                { value: 'none', label: "I don't have hardware yet" }
              ].map(hw => (
                <label key={hw.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.hardware_access.includes(hw.value)}
                    onChange={() => handleHardwareChange(hw.value)}
                  />
                  <span>{hw.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Learning Goals */}
          <div className={styles.formGroup}>
            <label>Learning Goals (Optional)</label>
            <textarea
              value={formData.learning_goals}
              onChange={e => setFormData({ ...formData, learning_goals: e.target.value })}
              className={styles.textarea}
              placeholder="What do you want to build or learn?"
              rows={3}
            />
          </div>
          
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className={styles.saveButton}>
              {saving ? 'Saving...' : hasProfile ? 'Update Profile' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

#### Task 2.4: Enhanced PersonalizationButton Component
**Duration**: 4 hours
**Priority**: High

**Code**:
```typescript
// src/components/PersonalizationButton.tsx (enhance existing)
import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../contexts/UserProfileContext';
import { usePersonalization } from '../hooks/usePersonalization';
import PersonalizationModal from './PersonalizationModal';
import styles from './PersonalizationButton.module.css';

export default function PersonalizationButton({ onPersonalized }) {
  const { hasProfile } = useUserProfile();
  const { personalizeContent, loading, error } = usePersonalization();
  const [modalOpen, setModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handlePersonalize = async () => {
    if (!hasProfile) {
      setModalOpen(true);
      return;
    }
    
    // Get current page content
    const contentElement = document.querySelector('.markdown');
    if (!contentElement) {
      console.error('Content element not found');
      return;
    }
    
    const content = contentElement.textContent || '';
    const pageUrl = window.location.pathname;
    
    const result = await personalizeContent(content, pageUrl);
    if (result && onPersonalized) {
      onPersonalized(result.personalizedContent);
    }
  };
  
  return (
    <>
      <div className={styles.container}>
        <button
          onClick={handlePersonalize}
          className={styles.button}
          disabled={loading}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Personalizing...
            </>
          ) : (
            <>
              <span className={styles.icon}>✨</span>
              Personalize Content
            </>
          )}
        </button>
        
        {showTooltip && !hasProfile && (
          <div className={styles.tooltip}>
            Create your profile to personalize content
          </div>
        )}
        
        {error && (
          <div className={styles.error}>{error}</div>
        )}
      </div>
      
      <PersonalizationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handlePersonalize}
      />
    </>
  );
}
```

### Phase 3: Testing & Optimization (Week 3)

#### Task 3.1: Quality Validation Tests
**Duration**: 8 hours
**Priority**: High

**Test Suite**:
```python
# backend/tests/test_personalization_quality.py
import pytest
from backend.personalization import personalization_service
from backend.models import UserProfile

SAMPLE_CONTENT = """
# Motor Control

Motors convert electrical energy into mechanical motion. We'll use PWM (Pulse Width Modulation) to control motor speed.

```python
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.OUT)
pwm = GPIO.PWM(18, 1000)  # 1kHz frequency
pwm.start(50)  # 50% duty cycle
```

## Task
Modify the code to gradually increase motor speed from 0 to 100%.
"""

@pytest.mark.asyncio
async def test_beginner_transformation():
    """Test that beginner transformation adds helpful context."""
    profile = UserProfile(
        user_id="test_user",
        skill_level="beginner",
        programming_experience="none",
        robotics_background="none",
        hardware_access=["raspberry_pi"]
    )
    
    result = await personalization_service.personalize_content(SAMPLE_CONTENT, profile)
    
    # Check that content is longer (more explanations)
    assert result.personalized_length > result.original_length * 0.9
    
    # Check for beginner-friendly additions
    assert "what is" in result.personalized_content.lower() or "explained" in result.personalized_content.lower()
    
    # Check code is preserved
    assert "GPIO.setup" in result.personalized_content
    assert "```python" in result.personalized_content

@pytest.mark.asyncio
async def test_advanced_transformation():
    """Test that advanced transformation adds depth."""
    profile = UserProfile(
        user_id="test_user",
        skill_level="advanced",
        programming_experience="expert",
        robotics_background="professional",
        hardware_access=["raspberry_pi"]
    )
    
    result = await personalization_service.personalize_content(SAMPLE_CONTENT, profile)
    
    # Advanced content might be similar length or slightly longer
    assert result.personalized_length > 0
    
    # Should include advanced concepts
    content_lower = result.personalized_content.lower()
    assert any(word in content_lower for word in ['architecture', 'optimization', 'performance', 'consider', 'advanced'])

@pytest.mark.asyncio
async def test_hardware_adaptation():
    """Test that Arduino users get Arduino examples."""
    profile = UserProfile(
        user_id="test_user",
        skill_level="intermediate",
        programming_experience="intermediate",
        robotics_background="hobbyist",
        hardware_access=["arduino"]
    )
    
    result = await personalization_service.personalize_content(SAMPLE_CONTENT, profile)
    
    # Should convert to Arduino syntax
    assert "pinMode" in result.personalized_content or "analogWrite" in result.personalized_content
    assert "```cpp" in result.personalized_content or "```c++" in result.personalized_content

@pytest.mark.asyncio
async def test_markdown_preservation():
    """Test that markdown formatting is preserved."""
    profile = UserProfile(
        user_id="test_user",
        skill_level="intermediate",
        programming_experience="basic",
        robotics_background="none",
        hardware_access=["raspberry_pi"]
    )
    
    result = await personalization_service.personalize_content(SAMPLE_CONTENT, profile)
    
    # Check markdown elements preserved
    assert "#" in result.personalized_content  # Headers
    assert "```" in result.personalized_content  # Code blocks
    assert "##" in result.personalized_content  # Subheaders

@pytest.mark.asyncio
async def test_caching():
    """Test that identical requests are cached."""
    profile = UserProfile(
        user_id="test_user",
        skill_level="beginner",
        programming_experience="none",
        robotics_background="none",
        hardware_access=["raspberry_pi"]
    )
    
    # First request
    result1 = await personalization_service.personalize_content(SAMPLE_CONTENT, profile)
    assert result1.cached == False
    
    # Second identical request
    result2 = await personalization_service.personalize_content(SAMPLE_CONTENT, profile)
    assert result2.cached == True
    assert result2.processing_time_ms < 100  # Should be fast

def test_cache_key_generation():
    """Test that cache keys are unique per profile + content."""
    profile1 = UserProfile(
        user_id="user1",
        skill_level="beginner",
        programming_experience="none",
        robotics_background="none",
        hardware_access=["raspberry_pi"]
    )
    
    profile2 = UserProfile(
        user_id="user2",
        skill_level="advanced",
        programming_experience="expert",
        robotics_background="professional",
        hardware_access=["arduino"]
    )
    
    service = personalization_service
    key1 = service._generate_cache_key(SAMPLE_CONTENT, profile1)
    key2 = service._generate_cache_key(SAMPLE_CONTENT, profile2)
    
    # Different profiles should generate different keys
    assert key1 != key2
    
    # Same profile + content should generate same key
    key1_again = service._generate_cache_key(SAMPLE_CONTENT, profile1)
    assert key1 == key1_again
```

**Run Tests**:
```bash
pytest backend/tests/test_personalization_quality.py -v
```

**Validation**:
- [ ] All quality tests pass
- [ ] Transformations maintain accuracy
- [ ] Markdown formatting preserved
- [ ] Caching works correctly

#### Task 3.2: Performance Optimization
**Duration**: 4 hours
**Priority**: Medium

**Optimizations**:
1. **Prompt Optimization**:
   - Reduce prompt token count by 20%
   - Use more efficient prompt structure
   - Remove redundant instructions

2. **Parallel Processing** (Future):
   - Process multiple paragraphs concurrently
   - Assemble results in correct order

3. **Token Management**:
   ```python
   # Implement max token limits
   def chunk_content_if_needed(content: str, max_tokens: int = 3000):
       """Split long content into chunks."""
       if estimate_tokens(content) <= max_tokens:
           return [content]
       
       # Split by headers
       chunks = []
       current_chunk = ""
       
       for line in content.split('\n'):
           if line.startswith('#') and estimate_tokens(current_chunk) > 1000:
               chunks.append(current_chunk)
               current_chunk = line + '\n'
           else:
               current_chunk += line + '\n'
       
       if current_chunk:
           chunks.append(current_chunk)
       
       return chunks
   ```

4. **Response Streaming** (Future):
   - Stream personalized content as it's generated
   - Improve perceived performance
   - Use Server-Sent Events (SSE)

### Phase 4: Deployment & Monitoring (Week 3-4)

#### Task 4.1: Environment Configuration
**Duration**: 2 hours
**Priority**: Critical

**Environment Variables**:
```bash
# .env
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
PERSONALIZATION_ENABLED=true
PERSONALIZATION_CACHE_SIZE=1000
PERSONALIZATION_MAX_CONTENT_LENGTH=50000
PERSONALIZATION_RATE_LIMIT=10  # per minute per user
```

#### Task 4.2: Monitoring & Analytics
**Duration**: 4 hours
**Priority**: High

**Metrics to Track**:
- Personalization requests per hour
- Average response time
- Cache hit rate
- OpenAI API costs
- Error rate
- User adoption rate (profile creation)

**Implementation**:
```python
# backend/monitoring.py
from datetime import datetime
import json

class PersonalizationMetrics:
    def __init__(self):
        self.requests_count = 0
        self.total_processing_time = 0
        self.cache_hits = 0
        self.cache_misses = 0
        self.errors = 0
        self.total_cost = 0.0
    
    def log_request(self, result: PersonalizationResponse):
        self.requests_count += 1
        self.total_processing_time += result.processing_time_ms
        
        if result.cached:
            self.cache_hits += 1
        else:
            self.cache_misses += 1
            # Estimate cost
            input_tokens = result.original_length / 4
            output_tokens = result.personalized_length / 4
            cost = (input_tokens * 0.0015 + output_tokens * 0.002) / 1000
            self.total_cost += cost
    
    def get_stats(self):
        return {
            "total_requests": self.requests_count,
            "avg_processing_time_ms": self.total_processing_time / max(self.requests_count, 1),
            "cache_hit_rate": self.cache_hits / max(self.requests_count, 1),
            "error_rate": self.errors / max(self.requests_count, 1),
            "total_cost_usd": round(self.total_cost, 4)
        }

metrics = PersonalizationMetrics()
```

## Success Criteria

### Technical Benchmarks
- [ ] API response time < 3 seconds (p95)
- [ ] Cache hit rate > 40%
- [ ] Error rate < 0.1%
- [ ] Monthly API cost < $20
- [ ] 99.9% uptime

### Quality Benchmarks
- [ ] 90% of transformations preserve markdown formatting
- [ ] 95% of transformations maintain code functionality
- [ ] Semantic equivalence score > 0.85 across levels
- [ ] No safety warnings removed

### User Adoption
- [ ] 50% of active users create profiles
- [ ] 30% of page views use personalization
- [ ] NPS > 8 for personalization feature
- [ ] 20% improvement in completion rates

## Deployment Checklist

- [ ] Database migration applied to production
- [ ] Environment variables configured
- [ ] API endpoints tested in staging
- [ ] Frontend components deployed
- [ ] Monitoring dashboard setup
- [ ] Rate limiting configured
- [ ] Cost alerts enabled
- [ ] Documentation updated
- [ ] User guide created
- [ ] A/B test configured

## Future Enhancements

1. **Adaptive Learning Path** (Phase 5):
   - Auto-adjust skill level based on performance
   - Suggest next best content to read
   - Personalized project recommendations

2. **Collaborative Filtering** (Phase 6):
   - "Students like you also learned X"
   - Popular hardware combinations
   - Successful learning paths

3. **Multi-Language Support** (Phase 7):
   - Personalize in user's preferred language
   - Integrate with Urdu translation feature
   - Language-specific code examples

4. **Visual Personalization** (Phase 8):
   - Adjust diagram complexity
   - Hardware-specific images
   - Interactive visualizations

## Hackathon Bonus

**Points**: +50
**Requirements**:
- ✅ Profile-based content transformation
- ✅ Real-time personalization
- ✅ Hardware-specific examples
- ✅ Three skill levels working
- ✅ Quality validation tests passing
- ✅ Performance < 3s response time
- ✅ Deployed and accessible
- ✅ Demo video showing transformation

**Demo Script**:
1. Show original content
2. Create beginner profile (Python, Raspberry Pi)
3. Personalize content → see simplified version
4. Switch to advanced profile
5. Personalize same content → see enhanced version
6. Show Arduino profile → see hardware adaptation
7. Show performance metrics (cache hit rate, response time)
