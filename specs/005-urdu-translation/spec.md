# Feature Specification: Urdu Translation System

## Overview
A one-click translation system that converts any textbook page from English to Urdu using AI-powered translation, enabling 70+ million Urdu speakers to access Physical AI and Robotics education in their native language with proper right-to-left text rendering and cultural localization.

## Problem Statement

### Educational Accessibility Gap
**The Challenge**:
- Pakistan has 230+ million people, 70+ million Urdu speakers
- English proficiency barriers prevent many from accessing technical education
- Physical AI/Robotics education almost exclusively in English
- Urdu-speaking students struggle with complex technical concepts in foreign language
- Limited technical educational resources available in Urdu
- Pakistan's growing tech industry needs trained professionals

**Current Limitations**:
- Google Translate: Poor quality, loses technical accuracy, breaks markdown
- Manual Translation: Too expensive, time-consuming, not scalable
- No Translation: Excludes massive potential student population
- English-Only: Creates inequality in educational access

### Technical & Cultural Challenges
**Language Barriers**:
- Technical terms often lack direct Urdu equivalents
- Students must learn both the concept AND English terminology
- Cognitive load increases, comprehension decreases
- Takes 2-3x longer to understand English technical content

**User Experience Issues**:
- No seamless way to switch between languages
- Urdu text requires RTL rendering not supported by default
- Font selection critical for readability (Nastaliq script)
- Code blocks must remain LTR within RTL layout
- Translation loading times frustrate users

## Solution

### AI-Powered Translation with Quality Control
**Core Capabilities**:
- **One-Click Translation**: Single button to translate entire page to Urdu
- **Smart AI Translation**: GPT-3.5-turbo with specialized prompts for technical content
- **Markdown Preservation**: Maintains all formatting, headings, lists, emphasis
- **Code Preservation**: Keeps programming code unchanged, translates comments
- **Technical Term Handling**: English terms with Urdu explanations
- **RTL Rendering**: Proper right-to-left text layout and Urdu fonts
- **Instant Toggle**: Switch between English and Urdu views instantly
- **Translation Caching**: Store translations to avoid repeated API calls

### User Experience Flow
1. Student opens any textbook page in English
2. Sees "Translate to Urdu" button in top-right corner
3. Clicks button → Loading indicator shows (10-15 seconds)
4. Page content fades and transforms to Urdu with RTL layout
5. Button changes to "Show Original" for toggling back
6. Subsequent visits load instantly from cache

## User Stories

### As an Urdu-Speaking Student
- I want to translate any textbook page to Urdu with one click
- I want the translation to preserve technical accuracy
- I want to toggle between English and Urdu to compare
- I want code examples to remain unchanged (since code is in English)
- I want code comments translated so I understand what code does
- I want technical terms explained in both languages
- I want proper Urdu script and right-to-left reading direction
- I want instant loading after first translation (cached)
- I want readable Urdu fonts designed for screen reading

### As a Pakistani Teacher
- I want students to learn concepts in their native language first
- I want to encourage students to compare English and Urdu versions
- I want technically accurate translations, not word-for-word
- I want students to gradually build English vocabulary via bilingual learning
- I want to reduce dropout rates due to language barriers

### As a Content Creator
- I want translations to happen automatically via API
- I want to maintain single English source (no duplicate content)
- I want markdown structure preserved perfectly
- I want to control what gets translated (content) vs not (code)
- I want to update English content without breaking translations
- I want low-cost translation that scales

## Core Features

### 1. Translation Button Component

**Location**: Top-right of every textbook page (docs/* pages)

**Visual Design**:
```
┌─────────────────────────┐
│  🌐 Translate to Urdu   │  ← English mode (LTR)
└─────────────────────────┘

┌─────────────────────────┐
│  اردو میں ترجمہ کریں 🌐 │  ← Urdu mode (RTL)
└─────────────────────────┘
```

**States**:
- **Default**: Blue button with translation icon
- **Loading**: Spinner + "Translating..." text (10-15 sec)
- **Translated**: Green button "Show Original"
- **Error**: Red button "Translation Failed - Retry"

**Behavior**:
- Sticky position: Follows scroll
- Keyboard accessible: Tab navigation, Enter to activate
- Mobile responsive: Scales down on small screens
- Tooltip: Hover shows "Translate this page to Urdu"

### 2. Translation API Endpoint

**Endpoint**: `POST /api/translate`

**Request**:
```json
{
  "content": "# Introduction to Physical AI\n\nPhysical AI combines...",
  "sourceLanguage": "en",
  "targetLanguage": "ur",
  "contentType": "markdown",
  "preserveCode": true
}
```

**Response** (Success):
```json
{
  "success": true,
  "translatedContent": "# جسمانی AI کا تعارف\n\nPhysical AI (جسمانی مصنوعی ذہانت)...",
  "sourceLength": 1234,
  "translatedLength": 1456,
  "tokensUsed": 500,
  "cost": 0.0015,
  "cacheKey": "translate_intro-physical-ai_abc123_ur",
  "translationTime": 12.3
}
```

**Response** (Error):
```json
{
  "success": false,
  "error": "API_RATE_LIMIT",
  "message": "OpenAI rate limit exceeded. Please wait 60 seconds.",
  "retryAfter": 60
}
```

**Error Handling**:
- Rate limits: 429 → Wait and retry with exponential backoff
- API failures: 500 → Show error message, keep English version
- Timeout: 30s → Cancel request, show timeout message
- Invalid content: 400 → Log error, show generic failure message

### 3. Content Parsing & Translation Logic

**Parsing Pipeline**:
```
MDX Source
    ↓
Parse markdown structure
    ↓
Identify components:
  - Headings (#, ##, ###)
  - Paragraphs
  - Lists (- , 1. )
  - Code blocks (```)
  - Inline code (`)
  - Code comments (// , # )
  - Links, images
    ↓
Separate translatable vs non-translatable
    ↓
Send to GPT-3.5-turbo with specialized prompt
    ↓
Receive translated segments
    ↓
Reconstruct markdown with translations
    ↓
Return formatted Urdu content
```

**Translation Rules**:

✅ **Translate**:
- All headings
- All paragraph text
- List items
- Image alt text
- Link text (not URLs)
- Code comments (// and # in code blocks)
- JSX text content

❌ **Don't Translate**:
- Code blocks (entire ``` sections except comments)
- Inline code (`variable_name`)
- URLs and links
- Import statements
- Function names, variable names
- File paths
- HTML/JSX tags
- Mathematical equations (LaTeX)

**Technical Term Handling**:
```
Input:  "Artificial Intelligence uses machine learning algorithms"
Output: "Artificial Intelligence (مصنوعی ذہانت) machine learning (مشین لرننگ) 
         algorithms (الگورتھم) استعمال کرتا ہے"
```

### 4. Caching System

**Client-Side Cache (localStorage)**:
```javascript
const cacheKey = `translation_${pageSlug}_${contentHash}_${targetLang}`;
const cachedTranslation = localStorage.getItem(cacheKey);

if (cachedTranslation && !isCacheExpired(cachedTranslation)) {
  return JSON.parse(cachedTranslation).content;
}
```

**Cache Structure**:
```json
{
  "content": "# جسمانی AI کا تعارف...",
  "timestamp": 1703332800000,
  "contentHash": "abc123def456",
  "version": 1,
  "expiresAt": 1705924800000
}
```

**Cache Strategy**:
- **Storage**: Browser localStorage (5MB limit)
- **Key**: Page slug + content hash + language code
- **TTL**: 30 days
- **Invalidation**: Check content hash on page load
- **Cleanup**: Remove expired entries on app startup
- **Fallback**: If localStorage full, use session storage

**Cache Benefits**:
- Instant subsequent loads (0ms vs 12s)
- Reduced API costs (80%+ cache hit rate expected)
- Offline access to previously translated pages
- Better user experience

### 5. RTL Layout & Typography

**CSS Implementation**:
```css
/* RTL Container */
.content-urdu {
  direction: rtl;
  text-align: right;
  font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;
  font-size: 1.25rem;
  line-height: 2.2;
  letter-spacing: 0.02em;
}

/* Code blocks stay LTR */
.content-urdu pre,
.content-urdu code {
  direction: ltr;
  text-align: left;
  font-family: 'Fira Code', monospace;
}

/* Lists RTL */
.content-urdu ul,
.content-urdu ol {
  padding-right: 2rem;
  padding-left: 0;
}

/* Headings */
.content-urdu h1,
.content-urdu h2,
.content-urdu h3 {
  text-align: right;
  font-weight: 700;
}
```

**Font Loading**:
```html
<!-- Load Urdu font from Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">
```

**Typography Considerations**:
- Noto Nastaliq Urdu: Best web font for Urdu readability
- Larger font size: Nastaliq script needs 1.25rem vs 1rem for Latin
- Increased line height: Urdu diacritics need more vertical space
- Proper kerning: Letter spacing for connected script

### 6. Loading States & Progress Indication

**Translation Progress**:
```
┌─────────────────────────────────────┐
│                                     │
│     Translating to Urdu...          │
│     ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 45%      │
│                                     │
│     This may take 10-15 seconds     │
│     for longer pages                │
│                                     │
└─────────────────────────────────────┘
```

**Implementation**:
- Show overlay with semi-transparent background
- Animated spinner or progress bar
- Estimated time remaining
- Allow cancellation with "Cancel" button
- Preserve scroll position during translation
- Smooth fade transition between languages

**Performance Optimizations**:
- Chunk large pages (>4000 tokens) into smaller sections
- Translate in parallel when possible
- Show partial translations as they arrive
- Preload critical pages in background

## Technical Architecture

### Component Structure
```
TranslationButton.tsx
├── State Management
│   ├── isTranslated (boolean)
│   ├── isLoading (boolean)
│   ├── error (string | null)
│   └── cachedContent (string | null)
├── API Integration
│   └── translateContent(content, lang)
├── Cache Management
│   ├── getCachedTranslation()
│   ├── setCachedTranslation()
│   └── invalidateCache()
└── UI Rendering
    ├── Button Component
    ├── Loading Overlay
    └── Error Message
```

### Backend Architecture
```
backend/translation.py
├── Translation Service
│   ├── parse_markdown()
│   ├── extract_translatable_content()
│   ├── call_openai_api()
│   ├── reconstruct_markdown()
│   └── handle_technical_terms()
├── Caching Layer
│   ├── Redis cache (optional for server-side)
│   └── Cache invalidation logic
└── API Endpoint
    └── POST /api/translate
```

### OpenAI Integration
```python
def translate_content(content: str, target_lang: str) -> str:
    prompt = f"""You are a technical translator specializing in educational content.
    
    Translate the following Physical AI/Robotics textbook content from English to {target_lang}.
    
    Rules:
    1. Preserve markdown formatting
    2. Keep code blocks unchanged
    3. Translate code comments
    4. Technical terms: English (Native explanation)
    5. Natural, educational tone
    
    Content:
    {content}
    
    Provide only the translated text:"""
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a technical translator."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,  # Low temp for consistency
        max_tokens=2000
    )
    
    return response.choices[0].message.content
```

## User Experience Flow

### First-Time Translation
1. User opens `/docs/intro` page
2. Sees blue "🌐 Translate to Urdu" button in top-right
3. Clicks button
4. Button shows loading spinner "Translating..."
5. API call to `/api/translate` with page content
6. GPT-3.5 translates (10-15 seconds)
7. Page content smoothly transitions to Urdu
8. RTL layout applied, Urdu font loaded
9. Button changes to green "Show Original"
10. Translation cached in localStorage
11. User reads content in Urdu

### Subsequent Translations (Cached)
1. User returns to same page later
2. Clicks "Translate to Urdu"
3. Instant load from localStorage (0ms)
4. Content switches to Urdu immediately
5. No API call, no cost, no wait

### Toggling Between Languages
1. User clicks "Show Original"
2. Content fades to English instantly (cached in state)
3. LTR layout restored
4. Button returns to "Translate to Urdu"
5. Can toggle back and forth freely

### Error Handling Flow
1. Translation API fails (rate limit/timeout)
2. Error message shown: "Translation temporarily unavailable"
3. "Retry" button appears
4. Original English content remains visible
5. User can retry or continue reading in English

## Success Metrics

### Adoption Metrics
- **Target**: 30% of Pakistani visitors use Urdu translation
- **Measurement**: Track translation button clicks vs page views
- **Goal**: 1000+ unique Urdu translations per month within 3 months

### Quality Metrics
- **Translation Accuracy**: > 85% (human evaluation sample)
- **User Satisfaction**: > 4.0/5.0 rating for translation quality
- **Error Reports**: < 10 reported translation errors per 100 pages

### Performance Metrics
- **Translation Time**: < 15 seconds for 95% of pages
- **Cache Hit Rate**: > 75% after 2 weeks
- **UI Response**: Toggle < 100ms from cached translations

### Business Metrics
- **Cost Efficiency**: < $20/month for 1000 active users
- **Engagement**: 25% increase in time-on-page for Urdu users
- **Retention**: 20% increase in return visits from Pakistan
- **Completion**: 15% increase in module completion for Urdu users

## Future Enhancements

### Phase 2
- Human review workflow for quality assurance
- Community translation contributions
- Translation memory for consistency
- Support for Hindi, Bengali, Arabic

### Phase 3
- Urdu audio narration (text-to-speech)
- Urdu chatbot for Q&A in native language
- Video subtitle translation
- Offline mobile app with pre-translated content

## Hackathon Bonus Points
**+50 points** for implementing Urdu translation:
- Demonstrates commitment to accessibility and inclusion
- Addresses real-world problem for 70M+ users
- Shows technical sophistication (AI, RTL, caching)
- Market expansion potential (Pakistan's growing tech sector)
- Social impact: Education equity for underserved communities
