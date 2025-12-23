# Task Breakdown: Better-Auth Authentication System

## Overview
Complete task list for building and deploying the Better-Auth authentication system with Neon Postgres database, FastAPI backend, and React frontend.

**Total Estimated Duration**: 80 hours
**Timeline**: 2 weeks (10 working days)
**Team Size**: 1-2 developers

---

## Phase 1: Database Setup (Day 1)

### Task 1.1: Neon Account & Database Creation
**Status**: Complete
**Duration**: 30 minutes
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Sign up for Neon account (https://neon.tech)
- [x] Create new project "physical-ai-auth"
- [x] Select region (closest to target users)
- [x] Create main database "auth_db"
- [x] Create development branch
- [x] Get connection string
- [x] Save credentials securely

**Connection String Format**:
```
postgresql://user:password@host.region.neon.tech/dbname?sslmode=require
```

**Validation**:
- [x] Can access Neon dashboard
- [x] Connection string copied
- [x] Database shows as active

---

### Task 1.2: Database Schema Creation
**Status**: Complete
**Duration**: 1 hour
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Connect to Neon using psql or GUI tool
- [x] Create `users` table
- [x] Create `user_profiles` table
- [x] Create `sessions` table (optional)
- [x] Add constraints (email format, password length, etc.)
- [x] Create indexes for performance
- [x] Create `update_updated_at_column()` trigger function
- [x] Apply triggers to users and user_profiles

**SQL File**: `backend/migrations/001_create_auth_tables.sql`

**Tables Created**:
- `users`: Core user credentials and metadata
- `user_profiles`: Extended profile information
- `sessions`: Session tracking and audit trail

**Validation**:
- [x] All tables created successfully
- [x] Foreign keys working (user_profiles.user_id → users.id)
- [x] Constraints enforced (email format, enum values)
- [x] Indexes created (check with `\di` in psql)
- [x] Triggers working (updated_at auto-updates)

---

### Task 1.3: Demo Account Setup
**Status**: Complete
**Duration**: 15 minutes
**Priority**: High
**Assignee**: Backend Developer

**Steps**:
- [x] Generate bcrypt hash for "Teacher@123" password
- [x] Insert demo user into users table
- [x] Insert demo profile into user_profiles table
- [x] Verify demo account can be queried
- [x] Document demo credentials

**Demo Account**:
- Email: teacher@giaic.com
- Password: Teacher@123 (hash: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5oPY3t0i1BjEu)
- Name: GIAIC Teacher
- Programming Experience: advanced
- Robotics Background: professional
- Hardware Access: full_kit

**Validation**:
- [x] Can query demo user by email
- [x] Profile linked correctly
- [x] Password hash stored (not plain text)

---

### Task 1.4: Database Connection Module
**Status**: Complete
**Duration**: 1 hour
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Create `backend/database.py`
- [x] Install psycopg2-binary
- [x] Create connection pool
- [x] Create helper functions (get_db_connection, execute_query)
- [x] Add connection error handling
- [x] Test connection with simple query
- [x] Add connection to .env

**Functions Implemented**:
```python
def get_db_connection() -> connection
def execute_query(query: str, params: tuple) -> list
def execute_insert(query: str, params: tuple) -> int  # Returns inserted ID
def close_connection(conn: connection) -> None
```

**Environment Variables**:
```bash
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

**Validation**:
- [x] Connection pool initializes
- [x] Can execute SELECT query
- [x] Can execute INSERT query
- [x] Connection errors handled gracefully
- [x] No connection leaks

---

## Phase 2: Backend Auth Logic (Days 2-3)

### Task 2.1: Dependencies Installation
**Status**: Complete
**Duration**: 30 minutes
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Update `requirements.txt`
- [x] Activate virtual environment
- [x] Install all dependencies
- [x] Verify installations
- [x] Freeze versions

**Dependencies Added**:
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.0
python-dotenv==1.0.0
psycopg2-binary==2.9.9
bcrypt==4.1.2
PyJWT==2.8.0
python-multipart==0.0.6
```

**Validation**:
- [x] All packages install without errors
- [x] No version conflicts
- [x] Can import all packages in Python

---

### Task 2.2: Auth Module - Password Hashing
**Status**: Complete
**Duration**: 1 hour
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Create `backend/auth.py`
- [x] Import bcrypt
- [x] Implement `hash_password(password: str) -> str`
- [x] Implement `verify_password(password: str, hash: str) -> bool`
- [x] Set bcrypt cost factor to 12
- [x] Add error handling
- [x] Write unit tests

**Functions**:
```python
def hash_password(password: str) -> str:
    """Hash password using bcrypt with cost factor 12"""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against bcrypt hash"""
    return bcrypt.checkpw(
        password.encode('utf-8'),
        password_hash.encode('utf-8')
    )
```

**Unit Tests** (`tests/test_auth.py`):
- [x] test_hash_password_returns_string
- [x] test_hash_password_different_each_time
- [x] test_verify_password_correct
- [x] test_verify_password_incorrect
- [x] test_verify_password_wrong_format

**Validation**:
- [x] Hashed passwords are 60 characters
- [x] Same password produces different hashes
- [x] Correct password verifies successfully
- [x] Wrong password fails verification
- [x] All unit tests pass

---

### Task 2.3: Auth Module - JWT Tokens
**Status**: Complete
**Duration**: 2 hours
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Import PyJWT
- [x] Implement `create_token(user_id: int, email: str, days: int) -> str`
- [x] Implement `verify_token(token: str) -> dict`
- [x] Set JWT secret from environment (256-bit)
- [x] Use HS256 algorithm
- [x] Add expiration claim (exp)
- [x] Add issued-at claim (iat)
- [x] Handle expired tokens
- [x] Handle invalid tokens
- [x] Write unit tests

**Functions**:
```python
def create_token(user_id: int, email: str, days: int = 7) -> str:
    """Generate JWT token with 7-day expiration"""
    payload = {
        'user_id': user_id,
        'email': email,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=days)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return token

def verify_token(token: str) -> dict:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
```

**Environment Variables**:
```bash
JWT_SECRET=your-256-bit-secret-here-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7
```

**Unit Tests**:
- [x] test_create_token_returns_string
- [x] test_create_token_includes_claims
- [x] test_verify_token_valid
- [x] test_verify_token_expired
- [x] test_verify_token_invalid_signature
- [x] test_verify_token_malformed

**Validation**:
- [x] Token is 3-part JWT (header.payload.signature)
- [x] Token includes user_id, email, iat, exp
- [x] Valid token decodes successfully
- [x] Expired token raises error
- [x] Invalid signature raises error
- [x] All unit tests pass

---

### Task 2.4: Pydantic Models
**Status**: Complete
**Duration**: 1.5 hours
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Create `backend/models.py`
- [x] Define `SignupRequest` model
- [x] Define `LoginRequest` model
- [x] Define `ProfileUpdate` model
- [x] Define `User` response model
- [x] Define `UserProfile` model
- [x] Add field validators
- [x] Add custom validators (email format, password strength)
- [x] Write validation tests

**Models**:
```python
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Literal

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    programming_experience: Literal['beginner', 'intermediate', 'advanced'] = 'beginner'
    robotics_background: Literal['none', 'hobby', 'academic', 'professional'] = 'none'
    hardware_access: Literal['simulation_only', 'basic_kit', 'full_kit', 'custom_setup'] = 'simulation_only'
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isalpha() for c in v):
            raise ValueError('Password must contain at least one letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        return v
    
    @validator('name')
    def validate_name(cls, v):
        if len(v) < 2 or len(v) > 50:
            raise ValueError('Name must be between 2 and 50 characters')
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    programming_experience: Optional[Literal['beginner', 'intermediate', 'advanced']] = None
    robotics_background: Optional[Literal['none', 'hobby', 'academic', 'professional']] = None
    hardware_access: Optional[Literal['simulation_only', 'basic_kit', 'full_kit', 'custom_setup']] = None

class UserProfile(BaseModel):
    programming_experience: str
    robotics_background: str
    hardware_access: str
    completed_modules: list = []
    preferences: dict = {}

class User(BaseModel):
    id: int
    email: str
    name: str
    profile: UserProfile
    created_at: str
    last_login: Optional[str] = None
```

**Validation Tests**:
- [x] test_signup_request_valid
- [x] test_signup_request_invalid_email
- [x] test_signup_request_weak_password
- [x] test_signup_request_invalid_enum
- [x] test_login_request_valid
- [x] test_profile_update_partial

**Validation**:
- [x] Valid data passes validation
- [x] Invalid email rejected
- [x] Weak password rejected
- [x] Invalid enum value rejected
- [x] Type conversion works (email normalization)
- [x] All validation tests pass

---

### Task 2.5: Database Query Functions
**Status**: Complete
**Duration**: 3 hours
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Create `backend/db_queries.py`
- [x] Implement `create_user(email, password_hash, name) -> int`
- [x] Implement `create_profile(user_id, profile_data) -> None`
- [x] Implement `get_user_by_email(email) -> dict`
- [x] Implement `get_user_by_id(user_id) -> dict`
- [x] Implement `update_profile(user_id, profile_data) -> None`
- [x] Implement `update_last_login(user_id) -> None`
- [x] Implement `increment_failed_attempts(user_id) -> None`
- [x] Implement `reset_failed_attempts(user_id) -> None`
- [x] Add error handling
- [x] Write integration tests

**Functions**:
```python
def create_user(email: str, password_hash: str, name: str) -> int:
    """Insert new user and return ID"""
    query = """
        INSERT INTO users (email, password_hash, name)
        VALUES (%s, %s, %s)
        RETURNING id
    """
    result = execute_insert(query, (email, password_hash, name))
    return result

def create_profile(user_id: int, profile_data: dict) -> None:
    """Insert user profile"""
    query = """
        INSERT INTO user_profiles (
            user_id, 
            programming_experience, 
            robotics_background, 
            hardware_access
        )
        VALUES (%s, %s, %s, %s)
    """
    execute_query(query, (
        user_id,
        profile_data.get('programming_experience', 'beginner'),
        profile_data.get('robotics_background', 'none'),
        profile_data.get('hardware_access', 'simulation_only')
    ))

def get_user_by_email(email: str) -> Optional[dict]:
    """Retrieve user with profile by email"""
    query = """
        SELECT 
            u.id, u.email, u.password_hash, u.name, 
            u.created_at, u.last_login, u.failed_login_attempts, 
            u.locked_until,
            p.programming_experience, p.robotics_background, 
            p.hardware_access, p.completed_modules, p.preferences
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE u.email = %s AND u.is_active = TRUE
    """
    results = execute_query(query, (email,))
    return results[0] if results else None

def update_profile(user_id: int, profile_data: dict) -> None:
    """Update user profile fields"""
    fields = []
    values = []
    
    if 'programming_experience' in profile_data:
        fields.append('programming_experience = %s')
        values.append(profile_data['programming_experience'])
    
    if 'robotics_background' in profile_data:
        fields.append('robotics_background = %s')
        values.append(profile_data['robotics_background'])
    
    if 'hardware_access' in profile_data:
        fields.append('hardware_access = %s')
        values.append(profile_data['hardware_access'])
    
    if not fields:
        return
    
    values.append(user_id)
    query = f"UPDATE user_profiles SET {', '.join(fields)} WHERE user_id = %s"
    execute_query(query, tuple(values))
```

**Integration Tests** (`tests/test_db_queries.py`):
- [x] test_create_user_success
- [x] test_create_user_duplicate_email
- [x] test_get_user_by_email_exists
- [x] test_get_user_by_email_not_found
- [x] test_update_profile_single_field
- [x] test_update_profile_multiple_fields
- [x] test_increment_failed_attempts
- [x] test_reset_failed_attempts

**Validation**:
- [x] Can create user and get ID back
- [x] Duplicate email raises constraint error
- [x] Can retrieve user with profile
- [x] Can update profile fields
- [x] Failed login tracking works
- [x] All integration tests pass

---

## Phase 3: Backend API Endpoints (Days 4-5)

### Task 3.1: FastAPI Project Setup
**Status**: Complete
**Duration**: 1 hour
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Create `backend/main.py`
- [x] Initialize FastAPI app
- [x] Configure CORS
- [x] Add health check endpoint
- [x] Set up routers structure
- [x] Add request logging
- [x] Test server starts

**Main App** (`backend/main.py`):
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Physical AI Auth API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "auth-api"}

# Include auth router
from routers import auth
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
```

**Validation**:
- [x] Server starts on http://localhost:8000
- [x] Health check returns 200
- [x] CORS headers present in response
- [x] Swagger docs at /docs

---

### Task 3.2: POST /api/auth/signup Endpoint
**Status**: Complete
**Duration**: 3 hours
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Create `backend/routers/auth.py`
- [x] Define signup endpoint
- [x] Validate request with Pydantic
- [x] Check email doesn't exist
- [x] Hash password
- [x] Create user in database
- [x] Create profile in database
- [x] Generate JWT token
- [x] Return user object + token
- [x] Handle errors (duplicate email, database errors)
- [x] Write endpoint tests

**Endpoint Implementation**:
```python
from fastapi import APIRouter, HTTPException, status
from models import SignupRequest, User, UserProfile
from auth import hash_password, create_token
from db_queries import create_user, create_profile, get_user_by_email

router = APIRouter()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(request: SignupRequest):
    """Create new user account"""
    
    # Check if email already exists
    existing_user = get_user_by_email(request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # Hash password
    password_hash = hash_password(request.password)
    
    # Create user
    try:
        user_id = create_user(request.email, password_hash, request.name)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    # Create profile
    profile_data = {
        'programming_experience': request.programming_experience,
        'robotics_background': request.robotics_background,
        'hardware_access': request.hardware_access
    }
    create_profile(user_id, profile_data)
    
    # Generate token
    token = create_token(user_id, request.email)
    
    # Return user object
    user = User(
        id=user_id,
        email=request.email,
        name=request.name,
        profile=UserProfile(**profile_data),
        created_at=datetime.utcnow().isoformat()
    )
    
    return {
        "user": user,
        "token": token
    }
```

**Tests** (`tests/test_endpoints.py`):
- [x] test_signup_success
- [x] test_signup_duplicate_email
- [x] test_signup_invalid_email
- [x] test_signup_weak_password
- [x] test_signup_missing_fields
- [x] test_signup_invalid_enum

**Validation**:
- [x] Returns 201 on success
- [x] Returns user object with token
- [x] Returns 409 for duplicate email
- [x] Returns 400 for validation errors
- [x] Password stored as hash (not plain text)
- [x] Profile created with correct values
- [x] All endpoint tests pass

---

### Task 3.3: POST /api/auth/login Endpoint
**Status**: Complete
**Duration**: 2 hours
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Define login endpoint
- [x] Validate request (email, password)
- [x] Retrieve user by email
- [x] Check account not locked
- [x] Verify password
- [x] Update last_login timestamp
- [x] Reset failed_login_attempts to 0
- [x] Generate JWT token
- [x] Return user object + token
- [x] Handle errors (wrong password, account locked)
- [x] Write endpoint tests

**Endpoint Implementation**:
```python
@router.post("/login")
def login(request: LoginRequest):
    """Authenticate user and return JWT token"""
    
    # Get user
    user = get_user_by_email(request.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if account locked
    if user['locked_until'] and datetime.utcnow() < user['locked_until']:
        remaining = (user['locked_until'] - datetime.utcnow()).seconds // 60
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail=f"Account locked. Try again in {remaining} minutes."
        )
    
    # Verify password
    if not verify_password(request.password, user['password_hash']):
        # Increment failed attempts
        increment_failed_attempts(user['id'])
        
        # Lock account after 5 failed attempts
        if user['failed_login_attempts'] + 1 >= 5:
            lock_account(user['id'], minutes=15)
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail="Too many failed attempts. Account locked for 15 minutes."
            )
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Success - reset failed attempts and update last login
    reset_failed_attempts(user['id'])
    update_last_login(user['id'])
    
    # Generate token
    token = create_token(user['id'], user['email'])
    
    # Return user object
    user_obj = User(
        id=user['id'],
        email=user['email'],
        name=user['name'],
        profile=UserProfile(
            programming_experience=user['programming_experience'],
            robotics_background=user['robotics_background'],
            hardware_access=user['hardware_access'],
            completed_modules=user['completed_modules'],
            preferences=user['preferences']
        ),
        created_at=user['created_at'].isoformat(),
        last_login=datetime.utcnow().isoformat()
    )
    
    return {
        "user": user_obj,
        "token": token
    }
```

**Tests**:
- [x] test_login_success
- [x] test_login_wrong_password
- [x] test_login_nonexistent_email
- [x] test_login_account_locked
- [x] test_login_locks_after_5_attempts
- [x] test_login_resets_failed_attempts_on_success

**Validation**:
- [x] Returns 200 on success
- [x] Returns user object with token
- [x] Returns 401 for wrong password
- [x] Returns 423 for locked account
- [x] Failed attempts increment correctly
- [x] Account locks after 5 attempts
- [x] All endpoint tests pass

---

### Task 3.4: GET /api/auth/me Endpoint
**Status**: Complete
**Duration**: 1.5 hours
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Define /me endpoint
- [x] Create authentication dependency
- [x] Extract JWT from Authorization header
- [x] Verify token
- [x] Retrieve user from database
- [x] Return user object
- [x] Handle errors (invalid token, expired token, user not found)
- [x] Write endpoint tests

**Authentication Dependency**:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token and return user"""
    token = credentials.credentials
    
    try:
        payload = verify_token(token)
        user_id = payload['user_id']
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user
```

**Endpoint Implementation**:
```python
@router.get("/me")
def get_me(user=Depends(get_current_user)):
    """Get current authenticated user"""
    
    user_obj = User(
        id=user['id'],
        email=user['email'],
        name=user['name'],
        profile=UserProfile(
            programming_experience=user['programming_experience'],
            robotics_background=user['robotics_background'],
            hardware_access=user['hardware_access'],
            completed_modules=user['completed_modules'],
            preferences=user['preferences']
        ),
        created_at=user['created_at'].isoformat(),
        last_login=user['last_login'].isoformat() if user['last_login'] else None
    )
    
    return {"user": user_obj}
```

**Tests**:
- [x] test_get_me_with_valid_token
- [x] test_get_me_with_invalid_token
- [x] test_get_me_with_expired_token
- [x] test_get_me_without_token
- [x] test_get_me_user_deleted

**Validation**:
- [x] Returns 200 with user object for valid token
- [x] Returns 401 for invalid token
- [x] Returns 401 for expired token
- [x] Returns 401 for missing token
- [x] Returns 404 if user deleted
- [x] All endpoint tests pass

---

### Task 3.5: PUT /api/auth/profile Endpoint
**Status**: Complete
**Duration**: 1.5 hours
**Priority**: High
**Assignee**: Backend Developer

**Steps**:
- [x] Define /profile endpoint
- [x] Require authentication (use dependency)
- [x] Validate request with ProfileUpdate model
- [x] Update profile in database
- [x] Return updated user object
- [x] Handle errors (validation, database)
- [x] Write endpoint tests

**Endpoint Implementation**:
```python
@router.put("/profile")
def update_profile_endpoint(
    request: ProfileUpdate,
    user=Depends(get_current_user)
):
    """Update user profile"""
    
    # Extract non-None fields
    update_data = request.dict(exclude_none=True)
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    
    # Update in database
    try:
        if 'name' in update_data:
            update_user_name(user['id'], update_data['name'])
        
        profile_fields = {
            k: v for k, v in update_data.items()
            if k in ['programming_experience', 'robotics_background', 'hardware_access']
        }
        
        if profile_fields:
            update_profile(user['id'], profile_fields)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )
    
    # Get updated user
    updated_user = get_user_by_id(user['id'])
    
    user_obj = User(
        id=updated_user['id'],
        email=updated_user['email'],
        name=updated_user['name'],
        profile=UserProfile(
            programming_experience=updated_user['programming_experience'],
            robotics_background=updated_user['robotics_background'],
            hardware_access=updated_user['hardware_access'],
            completed_modules=updated_user['completed_modules'],
            preferences=updated_user['preferences']
        ),
        created_at=updated_user['created_at'].isoformat(),
        last_login=updated_user['last_login'].isoformat() if updated_user['last_login'] else None
    )
    
    return {"user": user_obj}
```

**Tests**:
- [x] test_update_profile_name_only
- [x] test_update_profile_experience_only
- [x] test_update_profile_multiple_fields
- [x] test_update_profile_no_fields
- [x] test_update_profile_without_auth
- [x] test_update_profile_invalid_enum

**Validation**:
- [x] Returns 200 with updated user
- [x] Can update single field
- [x] Can update multiple fields
- [x] Returns 400 for no fields
- [x] Returns 401 without auth
- [x] Returns 400 for invalid enum
- [x] All endpoint tests pass

---

### Task 3.6: POST /api/auth/logout Endpoint
**Status**: Complete
**Duration**: 1 hour
**Priority**: Medium
**Assignee**: Backend Developer

**Steps**:
- [x] Define /logout endpoint
- [x] Require authentication
- [x] Optional: Add token to blacklist
- [x] Return success message
- [x] Write endpoint tests

**Endpoint Implementation**:
```python
@router.post("/logout")
def logout(user=Depends(get_current_user)):
    """Logout user (client should clear token)"""
    
    # Optional: Add token to blacklist in database
    # For now, client-side token clearing is sufficient
    
    return {"message": "Logged out successfully"}
```

**Tests**:
- [x] test_logout_with_valid_token
- [x] test_logout_without_token

**Validation**:
- [x] Returns 200 with success message
- [x] Returns 401 without token
- [x] All endpoint tests pass

---

### Task 3.7: Rate Limiting Middleware
**Status**: Complete
**Duration**: 2 hours
**Priority**: High
**Assignee**: Backend Developer

**Steps**:
- [x] Install slowapi package
- [x] Create rate limiter middleware
- [x] Apply to /login endpoint (5 requests/minute)
- [x] Apply to /signup endpoint (3 requests/minute)
- [x] Configure rate limits from environment
- [x] Test rate limiting
- [x] Write tests

**Implementation** (`backend/middleware/rate_limit.py`):
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)

# Apply to FastAPI app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Apply to endpoints
@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, login_data: LoginRequest):
    # ... implementation
    pass
```

**Tests**:
- [x] test_rate_limit_login_5_requests
- [x] test_rate_limit_signup_3_requests
- [x] test_rate_limit_returns_429

**Validation**:
- [x] Rate limiting works
- [x] Returns 429 after limit exceeded
- [x] Counter resets after time window
- [x] All rate limit tests pass

---

## Phase 4: Frontend Auth Components (Days 6-7)

### Task 4.1: Auth Context Setup
**Status**: Complete
**Duration**: 2 hours
**Priority**: Critical
**Assignee**: Frontend Developer

**Steps**:
- [x] Create `src/contexts/AuthContext.tsx`
- [x] Define AuthContext interface
- [x] Implement AuthProvider component
- [x] Implement useState for user and loading
- [x] Implement login function
- [x] Implement signup function
- [x] Implement logout function
- [x] Implement updateProfile function
- [x] Implement token refresh on mount
- [x] Wrap app in AuthProvider
- [x] Write context tests

**AuthContext** (`src/contexts/AuthContext.tsx`):
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  name: string;
  profile: {
    programming_experience: string;
    robotics_background: string;
    hardware_access: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdate) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);
  
  async function fetchCurrentUser(token: string) {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (err) {
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  }
  
  async function login(email: string, password: string) {
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      setUser(response.data.user);
      localStorage.setItem('auth_token', response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    }
  }
  
  async function signup(data: SignupData) {
    setError(null);
    try {
      const response = await axios.post('/api/auth/signup', data);
      setUser(response.data.user);
      localStorage.setItem('auth_token', response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed');
      throw err;
    }
  }
  
  function logout() {
    setUser(null);
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  }
  
  async function updateProfile(data: ProfileUpdate) {
    const token = localStorage.getItem('auth_token');
    const response = await axios.put('/api/auth/profile', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(response.data.user);
  }
  
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      signup,
      logout,
      updateProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Tests** (`src/contexts/AuthContext.test.tsx`):
- [x] test_auth_provider_renders_children
- [x] test_login_updates_user_state
- [x] test_logout_clears_user_state
- [x] test_signup_creates_user
- [x] test_token_persists_on_reload

**Validation**:
- [x] Context provides all functions
- [x] Login updates user state
- [x] Logout clears user state
- [x] Token persists in localStorage
- [x] All context tests pass

---

### Task 4.2: Login Component
**Status**: In Progress
**Duration**: 3 hours
**Priority**: Critical
**Assignee**: Frontend Developer

**Steps**:
- [ ] Create `src/components/Login.tsx`
- [ ] Create `src/components/Login.module.css`
- [ ] Implement form with email and password fields
- [ ] Add "Remember me" checkbox
- [ ] Add form validation (client-side)
- [ ] Implement handleSubmit function
- [ ] Show loading state during submission
- [ ] Show error messages
- [ ] Add link to signup page
- [ ] Pre-fill demo credentials (dev mode)
- [ ] Write component tests

**Component** (`src/components/Login.tsx`):
```typescript
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  }
  
  function fillDemoCredentials() {
    setEmail('teacher@giaic.com');
    setPassword('Teacher@123');
  }
  
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Login to Physical AI</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <button type="button" onClick={fillDemoCredentials}>
          Use Demo Account
        </button>
        
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}
```

**Styling** (`src/components/Login.module.css`):
```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.field input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background: #5568d3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```

**Tests** (`src/components/Login.test.tsx`):
- [ ] test_login_form_renders
- [ ] test_login_form_validation
- [ ] test_login_success_redirects
- [ ] test_login_failure_shows_error
- [ ] test_demo_credentials_button

**Validation**:
- [ ] Form renders correctly
- [ ] Validation works (email format, required fields)
- [ ] Successful login redirects to dashboard
- [ ] Failed login shows error message
- [ ] Loading state disables form
- [ ] Demo credentials button works
- [ ] All component tests pass

---

### Task 4.3: Signup Component
**Status**: Not Started
**Duration**: 4 hours
**Priority**: Critical
**Assignee**: Frontend Developer

**Steps**:
- [ ] Create `src/components/Signup.tsx`
- [ ] Create `src/components/Signup.module.css`
- [ ] Implement multi-step form (3 steps)
- [ ] Step 1: Email, password, confirm password, name
- [ ] Step 2: Profile questionnaire (3 questions)
- [ ] Step 3: Welcome message with recommendations
- [ ] Add form validation (password strength, email format)
- [ ] Implement handleSubmit function
- [ ] Show loading state during submission
- [ ] Show error messages
- [ ] Add navigation between steps
- [ ] Write component tests

**Component Structure**:
```typescript
// Step 1: Credentials
<CredentialsStep 
  data={formData}
  onChange={handleChange}
  onNext={nextStep}
/>

// Step 2: Profile
<ProfileStep
  data={formData}
  onChange={handleChange}
  onBack={prevStep}
  onSubmit={handleSubmit}
/>

// Step 3: Welcome
<WelcomeStep
  user={user}
  onComplete={() => navigate('/dashboard')}
/>
```

**Tests**:
- [ ] test_signup_step_1_renders
- [ ] test_signup_step_2_renders
- [ ] test_signup_step_3_renders
- [ ] test_signup_navigation
- [ ] test_signup_validation
- [ ] test_signup_success

**Validation**:
- [ ] 3-step form works
- [ ] Can navigate back and forth
- [ ] Validation prevents invalid submissions
- [ ] Successful signup creates user
- [ ] All component tests pass

---

### Task 4.4: Profile Component
**Status**: Not Started
**Duration**: 2.5 hours
**Priority**: High
**Assignee**: Frontend Developer

**Steps**:
- [ ] Create `src/components/Profile.tsx`
- [ ] Create `src/components/Profile.module.css`
- [ ] Display current user information
- [ ] Add edit mode toggle
- [ ] Implement edit form
- [ ] Add form validation
- [ ] Implement handleSave function
- [ ] Show loading state during save
- [ ] Show success/error messages
- [ ] Write component tests

**Validation**:
- [ ] Profile displays correctly
- [ ] Edit mode works
- [ ] Can update profile fields
- [ ] Changes save to database
- [ ] All component tests pass

---

### Task 4.5: Protected Route Wrapper
**Status**: Not Started
**Duration**: 1.5 hours
**Priority**: Critical
**Assignee**: Frontend Developer

**Steps**:
- [ ] Create `src/components/ProtectedRoute.tsx`
- [ ] Check authentication status
- [ ] Redirect to login if not authenticated
- [ ] Show loading spinner during auth check
- [ ] Pass user to child component
- [ ] Write component tests

**Implementation**:
```typescript
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

**Tests**:
- [ ] test_redirects_when_not_authenticated
- [ ] test_renders_children_when_authenticated
- [ ] test_shows_loading_during_check

**Validation**:
- [ ] Redirects to login when not authenticated
- [ ] Renders children when authenticated
- [ ] Shows loading spinner
- [ ] All tests pass

---

### Task 4.6: Axios Configuration
**Status**: Not Started
**Duration**: 1 hour
**Priority**: High
**Assignee**: Frontend Developer

**Steps**:
- [ ] Create `src/lib/axios.ts`
- [ ] Configure base URL
- [ ] Add request interceptor (attach token)
- [ ] Add response interceptor (handle 401)
- [ ] Set timeout (30 seconds)
- [ ] Export configured instance

**Configuration**:
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
});

// Add token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Validation**:
- [ ] Token attached to requests
- [ ] 401 redirects to login
- [ ] Timeout works
- [ ] Base URL correct

---

## Phase 5: Integration & Testing (Days 8-9)

### Task 5.1: End-to-End Testing
**Status**: Not Started
**Duration**: 4 hours
**Priority**: High
**Assignee**: QA/Developer

**Steps**:
- [ ] Install Playwright or Cypress
- [ ] Write signup flow test
- [ ] Write login flow test
- [ ] Write profile update flow test
- [ ] Write logout flow test
- [ ] Write session persistence test
- [ ] Run all E2E tests
- [ ] Fix any failures

**E2E Tests**:
- [ ] test_complete_signup_flow
- [ ] test_complete_login_flow
- [ ] test_complete_profile_update_flow
- [ ] test_complete_logout_flow
- [ ] test_session_persists_on_reload
- [ ] test_protected_route_redirect

**Validation**:
- [ ] All E2E tests pass
- [ ] Flows work end-to-end
- [ ] No console errors

---

### Task 5.2: Bug Fixing & Polish
**Status**: Not Started
**Duration**: 4 hours
**Priority**: High
**Assignee**: Team

**Steps**:
- [ ] Fix any failing tests
- [ ] Fix console errors
- [ ] Improve error messages
- [ ] Add loading states everywhere
- [ ] Improve responsive design
- [ ] Add keyboard navigation
- [ ] Test on mobile devices
- [ ] Test on different browsers

**Validation**:
- [ ] No failing tests
- [ ] No console errors
- [ ] Works on mobile
- [ ] Works on Chrome, Firefox, Safari

---

## Phase 6: Security Hardening (Day 10)

### Task 6.1: Security Audit
**Status**: Not Started
**Duration**: 3 hours
**Priority**: Critical
**Assignee**: Security Lead

**Steps**:
- [ ] Verify password hashing (bcrypt cost 12)
- [ ] Verify JWT secret is secure (256-bit)
- [ ] Verify httpOnly cookies in production
- [ ] Verify secure flag (HTTPS-only)
- [ ] Verify SameSite attribute
- [ ] Verify CORS configuration
- [ ] Verify rate limiting
- [ ] Verify SQL injection prevention
- [ ] Verify XSS prevention
- [ ] Run OWASP ZAP scan
- [ ] Fix any vulnerabilities

**OWASP Top 10 Checklist**:
- [ ] A01: Broken Access Control
- [ ] A02: Cryptographic Failures
- [ ] A03: Injection
- [ ] A04: Insecure Design
- [ ] A05: Security Misconfiguration
- [ ] A06: Vulnerable Components
- [ ] A07: Authentication Failures
- [ ] A08: Software/Data Integrity
- [ ] A09: Logging/Monitoring Failures
- [ ] A10: Server-Side Request Forgery

**Validation**:
- [ ] Passes all security checks
- [ ] No critical vulnerabilities
- [ ] Security report generated

---

### Task 6.2: Production Configuration
**Status**: Not Started
**Duration**: 2 hours
**Priority**: Critical
**Assignee**: DevOps

**Steps**:
- [ ] Set up production environment variables
- [ ] Generate secure JWT secret
- [ ] Configure Neon production database
- [ ] Set up CORS for production domain
- [ ] Enable HTTPS (Let's Encrypt)
- [ ] Configure logging (no sensitive data)
- [ ] Set up monitoring (Sentry)
- [ ] Create database backups
- [ ] Document deployment process

**Production Checklist**:
- [ ] Environment variables set
- [ ] Database migrated
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Monitoring set up
- [ ] Backups scheduled
- [ ] Documentation complete

**Validation**:
- [ ] Production environment ready
- [ ] All security features enabled
- [ ] Monitoring working

---

### Task 6.3: Load Testing
**Status**: Not Started
**Duration**: 2 hours
**Priority**: Medium
**Assignee**: DevOps

**Steps**:
- [ ] Install load testing tool (Locust, k6)
- [ ] Write load test scenarios
- [ ] Test signup endpoint (100 concurrent users)
- [ ] Test login endpoint (500 concurrent users)
- [ ] Test /me endpoint (1000 concurrent users)
- [ ] Measure response times
- [ ] Identify bottlenecks
- [ ] Optimize if needed

**Load Test Scenarios**:
- [ ] 100 signups/minute
- [ ] 500 logins/minute
- [ ] 1000 profile requests/minute
- [ ] Sustained load for 10 minutes

**Success Criteria**:
- [ ] Signup < 2 seconds (95th percentile)
- [ ] Login < 1 second (95th percentile)
- [ ] Profile fetch < 500ms (95th percentile)
- [ ] No 500 errors under load
- [ ] Database connections stable

**Validation**:
- [ ] Load tests pass
- [ ] Performance acceptable
- [ ] No bottlenecks identified

---

## Final Deployment

### Task 7.1: Deployment
**Status**: Not Started
**Duration**: 2 hours
**Priority**: Critical
**Assignee**: DevOps

**Steps**:
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Run database migrations on production
- [ ] Insert demo account
- [ ] Smoke test all endpoints
- [ ] Smoke test all UI flows
- [ ] Monitor for errors
- [ ] Create deployment documentation

**Validation**:
- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Database migrated
- [ ] Demo account works
- [ ] All flows working

---

### Task 7.2: Documentation
**Status**: Not Started
**Duration**: 2 hours
**Priority**: High
**Assignee**: Tech Writer

**Steps**:
- [ ] Write API documentation
- [ ] Write user guide (how to sign up, login)
- [ ] Write developer guide (how to integrate auth)
- [ ] Document demo account
- [ ] Document troubleshooting
- [ ] Create video walkthrough

**Documentation**:
- [ ] API docs (Swagger UI)
- [ ] User guide (Markdown)
- [ ] Developer guide (Markdown)
- [ ] Video walkthrough (Loom)

**Validation**:
- [ ] Documentation complete
- [ ] Easy to follow
- [ ] Covers all features

---

## Summary

### Total Time Breakdown
| Phase | Duration |
|-------|----------|
| Database Setup | 3.75 hours |
| Backend Auth Logic | 8 hours |
| Backend API Endpoints | 11 hours |
| Frontend Components | 14.5 hours |
| Integration & Testing | 8 hours |
| Security Hardening | 7 hours |
| Deployment & Docs | 4 hours |
| **Total** | **56.25 hours** |

### Progress Tracking
- **Phase 1**: ✅ 100% Complete (4/4 tasks)
- **Phase 2**: ✅ 100% Complete (5/5 tasks)
- **Phase 3**: ✅ 85% Complete (6/7 tasks)
- **Phase 4**: 🟡 20% Complete (1/6 tasks)
- **Phase 5**: ⚪ 0% Complete (0/2 tasks)
- **Phase 6**: ⚪ 0% Complete (0/3 tasks)

**Overall Progress**: 60% Complete

### Next Steps
1. Complete Task 4.2: Login Component
2. Complete Task 4.3: Signup Component
3. Complete Task 4.4: Profile Component
4. Complete Task 4.5: Protected Route Wrapper
5. Complete Task 4.6: Axios Configuration
6. Begin Phase 5: Integration & Testing

### Blockers
- None currently

### Risks
- Frontend development taking longer than estimated
- Security audit may uncover issues requiring refactoring
- Load testing may reveal performance bottlenecks

### Mitigation
- Allocate buffer time (20% contingency)
- Start security audit early
- Run preliminary load tests during development
