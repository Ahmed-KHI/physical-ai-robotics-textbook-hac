# Feature Specification: Better-Auth Authentication System

## Overview
A secure, modern authentication system built with Better-Auth 1.4.5, Neon Postgres, FastAPI, and React that provides user registration, login, session management, and personalized user profiles to enable adaptive learning experiences throughout the Physical AI & Robotics curriculum.

## Problem Statement
The Physical AI Textbook lacks user authentication, creating several critical issues:

### Learning Experience Problems
- **No Personalization**: Cannot adapt content to student's skill level
- **No Progress Tracking**: Students can't see which modules they've completed
- **No Saved State**: Lose all progress when switching devices
- **Generic Experience**: Same content for beginners and experts
- **No Community**: Cannot identify or connect with other learners

### Technical Limitations
- **No User Context**: RAG chatbot cannot personalize responses
- **No Access Control**: All content publicly accessible (good for MVP, limiting for premium features)
- **No Analytics**: Cannot track which students need help
- **No Adaptive Learning**: Cannot adjust difficulty based on performance
- **No Gamification**: Cannot implement badges, streaks, or achievements

### Administrative Challenges
- **No User Management**: Cannot identify or support specific students
- **No Usage Data**: Don't know who's using the platform
- **No Support Channel**: Cannot help students with their specific issues
- **No Communication**: Cannot notify users of updates or new content

Traditional solutions are inadequate:
- **Basic Auth**: Insecure, no modern features, poor UX
- **Firebase Auth**: Vendor lock-in, costs scale quickly, complex setup
- **Auth0**: Expensive ($25+/month), overkill for education platform
- **NextAuth**: Great but requires Next.js (we use Docusaurus)
- **Roll Your Own**: Security risks, time-consuming, reinventing the wheel

## Solution
Better-Auth 1.4.5 authentication system providing:
- **Secure Registration**: Email/password with best practices (bcrypt, JWT)
- **Fast Login**: < 1 second authentication with session persistence
- **User Profiles**: Collect learning context (experience, background, hardware)
- **Personalization Bridge**: Profile data drives adaptive recommendations
- **Session Management**: 7-day sessions with automatic refresh
- **Database Persistence**: Neon Postgres for scalable, reliable storage
- **Modern UX**: Clean React components with loading states and validation
- **Demo Account**: Pre-configured teacher account for testing (teacher@giaic.com)

## User Stories

### As a New Student
- I want to create an account quickly without jumping through hoops
- I want to tell the system my experience level so content is appropriate
- I want to specify what hardware I have access to
- I want my information saved so I don't lose progress
- I want a simple 3-step signup process
- I want clear feedback if something goes wrong
- I want to start learning immediately after signup

### As a Returning Student
- I want to log in quickly with my email and password
- I want my session to persist so I don't re-login constantly
- I want to see my profile and learning progress
- I want to update my profile if my situation changes
- I want personalized content recommendations based on my profile
- I want the chatbot to remember my skill level
- I want a secure logout option when using shared computers

### As a Teacher/Administrator
- I want to use a demo account to explore the platform
- I want to see how different profile types affect content recommendations
- I want to verify that authentication is working correctly
- I want to ensure student data is secure
- I want to understand what information we collect from students
- I want analytics on user signups and engagement (future)

### As a Developer
- I want a secure auth system following best practices
- I want clear API endpoints for auth operations
- I want TypeScript types for all auth models
- I want easy integration with other features (chatbot, personalization)
- I want comprehensive error handling
- I want testable auth flows
- I want environment-based configuration

## Core Features

### 1. User Registration
**Capabilities**:
- Email/password signup with validation
- Password strength requirements (8+ chars, mix of letters/numbers)
- Duplicate email detection
- Bcrypt password hashing (cost factor 12)
- Automatic JWT token generation
- Profile questionnaire during signup
- Welcome message with personalized recommendations

**Validation Rules**:
- Email: Valid format, unique, max 255 chars
- Password: Min 8 chars, at least 1 letter, 1 number
- Name: 2-50 characters, no special characters
- Programming Experience: beginner | intermediate | advanced
- Robotics Background: none | hobby | academic | professional
- Hardware Access: simulation_only | basic_kit | full_kit | custom_setup

**User Flow**:
1. User clicks "Sign Up" from navigation or login page
2. **Step 1**: Enter email, password, confirm password, name
3. **Step 2**: Answer profile questionnaire (3 questions with descriptions)
4. **Step 3**: Show welcome message, personalized recommendations, "Go to Dashboard"
5. Automatically logged in, redirected to suggested starting module

### 2. User Login
**Capabilities**:
- Email/password authentication
- Secure session creation (JWT tokens)
- "Remember me" functionality (7-day vs 24-hour sessions)
- Failed login tracking (5 attempts = 15-minute lockout)
- Last login timestamp tracking
- Error handling for wrong credentials
- Demo account support (teacher@giaic.com / Teacher@123)

**Security Features**:
- Password comparison using bcrypt
- Rate limiting (5 requests per minute per IP)
- Account lockout after 5 failed attempts
- Secure token storage (httpOnly cookies)
- Token expiration (7 days default, 24 hours without "remember me")
- HTTPS-only in production

**User Flow**:
1. User clicks "Login" from navigation
2. Enter email and password
3. Optional: Check "Remember me"
4. Click "Login"
5. Backend validates credentials
6. Return user object + JWT token
7. Frontend stores token, updates auth context
8. Redirect to previous page or dashboard

### 3. Profile Questionnaire
**Purpose**: Collect learning context to enable personalization

**Questions**:

**Q1: Programming Experience**
- beginner: "I'm new to programming"
- intermediate: "I know basics (variables, loops, functions)"
- advanced: "I'm comfortable with OOP, algorithms, and frameworks"

**Q2: Robotics Background**
- none: "I've never worked with robots"
- hobby: "I've built hobby projects (Arduino, simple bots)"
- academic: "I've taken robotics courses or completed projects"
- professional: "I have professional robotics experience"

**Q3: Hardware Access**
- simulation_only: "I only have access to simulations (Gazebo, WebSim)"
- basic_kit: "I have basic components (Arduino, sensors, servos)"
- full_kit: "I have recommended Physical AI kit"
- custom_setup: "I have custom hardware or industrial equipment"

**Data Usage**:
- Content difficulty adjustment (beginner → simpler explanations)
- Module recommendations (skip basics for advanced users)
- Hardware-specific examples (simulation code vs real hardware)
- Chatbot response complexity
- Exercise selection (theory-only vs hands-on)

### 4. Session Management
**JWT Token Structure**:
```json
{
  "user_id": 42,
  "email": "student@example.com",
  "iat": 1703001600,
  "exp": 1703606400
}
```

**Token Lifecycle**:
1. **Generation**: Created on login/signup with 7-day expiration
2. **Storage**: httpOnly cookie (not accessible to JavaScript)
3. **Validation**: Checked on every protected route
4. **Refresh**: Automatic renewal when < 24 hours remaining
5. **Revocation**: Cleared on logout or expiration

**Session Features**:
- Automatic token refresh on page load
- Graceful handling of expired sessions
- Session persistence across browser tabs
- Logout clears all session data
- Session tracking in database (optional, for security audit)

### 5. User Profile Management
**Profile View**:
- Display current email, name, profile settings
- Show account creation date
- Link to edit profile
- Show modules completed (future)
- Show current learning streak (future)

**Profile Edit**:
- Update name
- Change programming experience
- Change robotics background
- Change hardware access
- Save changes → re-run personalization
- Confirmation toast notification

**Cannot Edit**:
- Email (used as unique identifier)
- Account creation date
- User ID

### 6. Protected Routes
**Implementation**:
- Higher-order component (ProtectedRoute)
- Wraps pages requiring authentication
- Checks auth context on mount
- Redirects to login if not authenticated
- Passes user object to wrapped component

**Protected Pages**:
- `/profile` - User profile view/edit
- `/dashboard` - Personalized learning dashboard (future)
- `/progress` - Learning progress tracking (future)
- `/settings` - User preferences (future)

**Public Pages**:
- `/` - Home page
- `/docs/*` - All documentation pages
- `/blog/*` - Blog posts
- `/login` - Login page
- `/signup` - Signup page

### 7. Frontend Auth Context
**AuthProvider Component**:
- Wraps entire React app in Docusaurus
- Manages global auth state
- Provides auth functions to all components
- Handles token refresh automatically
- Persists non-sensitive data to localStorage

**Context Value**:
```typescript
{
  user: User | null,
  loading: boolean,
  error: string | null,
  login: (email: string, password: string) => Promise<void>,
  signup: (data: SignupData) => Promise<void>,
  logout: () => void,
  updateProfile: (data: ProfileUpdate) => Promise<void>,
  isAuthenticated: boolean
}
```

**State Management**:
- Initial load: Check localStorage for cached user
- Validate token with backend
- If valid: Set user state, mark loading complete
- If invalid: Clear state, redirect to login if on protected route
- On login/signup: Update state, persist to localStorage
- On logout: Clear state, clear localStorage, redirect to home

### 8. Backend API Endpoints

#### POST /api/auth/signup
**Request**:
```json
{
  "email": "student@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "programming_experience": "intermediate",
  "robotics_background": "hobby",
  "hardware_access": "basic_kit"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": 42,
    "email": "student@example.com",
    "name": "John Doe",
    "profile": {
      "programming_experience": "intermediate",
      "robotics_background": "hobby",
      "hardware_access": "basic_kit"
    },
    "created_at": "2024-12-23T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors**:
- 400: Validation failed (email format, password strength)
- 409: Email already exists
- 500: Server error (database connection, etc.)

#### POST /api/auth/login
**Request**:
```json
{
  "email": "student@example.com",
  "password": "SecurePass123"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 42,
    "email": "student@example.com",
    "name": "John Doe",
    "profile": {
      "programming_experience": "intermediate",
      "robotics_background": "hobby",
      "hardware_access": "basic_kit"
    },
    "last_login": "2024-12-23T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors**:
- 401: Invalid credentials
- 423: Account locked (too many failed attempts)
- 500: Server error

#### GET /api/auth/me
**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 42,
    "email": "student@example.com",
    "name": "John Doe",
    "profile": {
      "programming_experience": "intermediate",
      "robotics_background": "hobby",
      "hardware_access": "basic_kit",
      "completed_modules": [],
      "preferences": {}
    }
  }
}
```

**Errors**:
- 401: Invalid or expired token
- 404: User not found
- 500: Server error

#### PUT /api/auth/profile
**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Request**:
```json
{
  "name": "John Doe",
  "programming_experience": "advanced",
  "hardware_access": "full_kit"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 42,
    "email": "student@example.com",
    "name": "John Doe",
    "profile": {
      "programming_experience": "advanced",
      "robotics_background": "hobby",
      "hardware_access": "full_kit"
    }
  }
}
```

**Errors**:
- 401: Invalid or expired token
- 400: Validation failed
- 500: Server error

#### POST /api/auth/logout
**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

### 9. Database Schema

**users table**:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP
);
```

**user_profiles table**:
```sql
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    programming_experience VARCHAR(20) DEFAULT 'beginner',
    robotics_background VARCHAR(20) DEFAULT 'none',
    hardware_access VARCHAR(30) DEFAULT 'simulation_only',
    completed_modules JSONB DEFAULT '[]',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**sessions table** (optional, for audit trail):
```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
);
```

**Indexes**:
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │  Login.tsx  │  │ Signup.tsx   │  │ Profile.tsx     │    │
│  └──────┬──────┘  └──────┬───────┘  └────────┬────────┘    │
│         │                │                     │              │
│         └────────────────┴─────────────────────┘              │
│                          │                                    │
│                  ┌───────▼────────┐                          │
│                  │ AuthProvider   │ (React Context)          │
│                  │ - user state   │                          │
│                  │ - login()      │                          │
│                  │ - signup()     │                          │
│                  │ - logout()     │                          │
│                  └───────┬────────┘                          │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           │ HTTP Requests
                           │ Authorization: Bearer <token>
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                    Backend (FastAPI)                          │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Auth Endpoints                         │     │
│  │  POST /api/auth/signup                             │     │
│  │  POST /api/auth/login                              │     │
│  │  GET  /api/auth/me                                 │     │
│  │  PUT  /api/auth/profile                            │     │
│  │  POST /api/auth/logout                             │     │
│  └────────────┬───────────────────────────────────────┘     │
│               │                                              │
│  ┌────────────▼───────────┐   ┌─────────────────────┐      │
│  │    auth.py             │   │   database.py       │      │
│  │  - hash_password()     │   │  - get_user()       │      │
│  │  - verify_password()   │   │  - create_user()    │      │
│  │  - create_token()      │   │  - update_profile() │      │
│  │  - verify_token()      │   │  - get_profile()    │      │
│  └────────────────────────┘   └──────────┬──────────┘      │
│                                           │                  │
└───────────────────────────────────────────┼──────────────────┘
                                            │
                                            │ SQL Queries
                                            │
┌───────────────────────────────────────────▼──────────────────┐
│                   Database (Neon Postgres)                    │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────────┐  ┌───────────────┐   │
│  │   users     │  │  user_profiles  │  │   sessions    │   │
│  │             │  │                 │  │               │   │
│  │ - id        │  │ - user_id       │  │ - user_id     │   │
│  │ - email     │  │ - prog_exp      │  │ - token_hash  │   │
│  │ - pass_hash │  │ - robot_bg      │  │ - expires_at  │   │
│  │ - name      │  │ - hw_access     │  │ - created_at  │   │
│  └─────────────┘  └─────────────────┘  └───────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Success Criteria

### Functional Requirements
- [x] Users can create accounts with email/password
- [x] Users can log in with valid credentials
- [x] Users can log out and session is cleared
- [x] Users can view their profile
- [x] Users can update their profile
- [x] Profile questionnaire collects learning context
- [x] Demo account works (teacher@giaic.com / Teacher@123)
- [x] Protected routes redirect to login when unauthenticated
- [x] JWT tokens generated and validated correctly
- [x] Sessions persist across page reloads

### Security Requirements
- [x] Passwords hashed with bcrypt (cost factor 12)
- [x] JWT tokens use secure secret (256-bit minimum)
- [x] httpOnly cookies prevent XSS attacks
- [x] Rate limiting prevents brute force (5/min)
- [x] Account lockout after 5 failed attempts
- [x] SQL injection prevented (parameterized queries)
- [x] Input validation on all fields
- [x] CORS configured for production domain
- [x] No sensitive data in frontend localStorage
- [x] No passwords logged anywhere

### Performance Requirements
- [x] Signup completes in < 2 seconds
- [x] Login completes in < 1 second
- [x] Profile update completes in < 1 second
- [x] Token validation < 50ms
- [x] Database queries < 100ms
- [x] Session refresh seamless (no flicker)

### UX Requirements
- [x] Clear error messages for validation failures
- [x] Loading indicators during auth operations
- [x] Responsive design on mobile/tablet/desktop
- [x] Keyboard navigation works (tab, enter)
- [x] Password field toggles visibility
- [x] Form remembers values on validation error
- [x] Success confirmations (toasts/notifications)

### Integration Requirements
- [x] Auth context available to all React components
- [x] User profile data accessible to personalization engine
- [x] Chatbot can access user's skill level
- [x] Backend enforces authentication on protected routes
- [x] Frontend handles expired tokens gracefully

## Demo Account
**Purpose**: Testing, demonstrations, documentation screenshots

**Credentials**:
- Email: teacher@giaic.com
- Password: Teacher@123

**Profile**:
- Name: GIAIC Teacher
- Programming Experience: advanced
- Robotics Background: professional
- Hardware Access: full_kit

**Test Scenarios**:
1. Login with demo account
2. View personalized dashboard (advanced content)
3. Use chatbot (gets professional-level responses)
4. Access all modules (no restrictions)
5. Update profile → see recommendations change
6. Logout → session cleared

## Future Enhancements

### Phase 2 (After MVP)
- Password reset via email
- Email verification during signup
- Social login (Google, GitHub)
- Profile pictures (avatar upload)

### Phase 3 (Advanced Features)
- Two-factor authentication (2FA)
- Session management dashboard (view all devices)
- Account deletion with data export
- OAuth2 for third-party integrations

### Phase 4 (Admin Features)
- Admin panel for user management
- Analytics dashboard (signups, logins, activity)
- User support tools (password reset, unlock account)
- Bulk operations (export users, send announcements)
