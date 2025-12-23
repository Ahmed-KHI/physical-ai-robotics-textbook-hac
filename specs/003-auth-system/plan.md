# Implementation Plan: Better-Auth Authentication System

## Tech Stack Selection

### Authentication Library: Better-Auth 1.4.5

**Why Better-Auth?**
1. **Modern & Lightweight**: Built for current web standards, minimal dependencies
2. **Framework Agnostic**: Works with FastAPI backend + React frontend
3. **TypeScript First**: Full type safety out of the box
4. **Security Best Practices**: Built-in password hashing, JWT handling, session management
5. **Flexible**: Easy to customize and extend for specific needs
6. **Well-Documented**: Clear examples and guides
7. **Active Development**: Regular updates and security patches
8. **Open Source**: Free, no vendor lock-in

**Alternatives Considered**:
- ❌ **NextAuth.js**: Requires Next.js, we use Docusaurus
- ❌ **Auth0**: Expensive ($25+/month), overkill for education platform
- ❌ **Firebase Auth**: Vendor lock-in, costs scale with users
- ❌ **Passport.js**: Node.js only, we use Python backend
- ❌ **Supabase Auth**: Good but requires Supabase ecosystem
- ❌ **Custom JWT**: Reinventing the wheel, security risks

### Database: Neon Postgres

**Why Neon Postgres?**
1. **Serverless**: Auto-scaling, pay only for usage
2. **PostgreSQL**: Industry-standard, ACID compliance, robust
3. **Free Tier**: Generous limits (10GB storage, 100 hours compute/month)
4. **Branching**: Git-like database branches for dev/staging/prod
5. **Auto-Suspend**: Saves costs by pausing inactive databases
6. **Global Edge**: Low-latency connections worldwide
7. **SQL Support**: Full PostgreSQL 15 compatibility
8. **Migrations**: Easy schema versioning with psycopg2/SQLAlchemy

**Alternatives Considered**:
- ❌ **Supabase**: Good but more expensive at scale
- ❌ **PlanetScale**: MySQL-based, less feature-rich than Postgres
- ❌ **MongoDB Atlas**: NoSQL not ideal for relational user data
- ❌ **SQLite**: Not suitable for production web apps
- ❌ **Self-hosted Postgres**: Requires infrastructure management

### Backend Framework: FastAPI 0.109.0

**Why FastAPI?** (Already chosen for RAG backend)
1. **Consistency**: Same framework as RAG chatbot backend
2. **Performance**: Async by default, handles concurrent auth requests
3. **Type Safety**: Pydantic models for request/response validation
4. **Auto Documentation**: Swagger UI for testing auth endpoints
5. **Dependency Injection**: Clean middleware for JWT verification
6. **CORS Support**: Built-in, essential for React frontend
7. **Testing**: Easy unit testing with TestClient

**Auth-Specific Benefits**:
- Middleware for protected routes
- Easy JWT token extraction from headers/cookies
- Request context for user object
- Exception handlers for auth errors

### Password Hashing: bcrypt

**Why bcrypt?**
1. **Industry Standard**: Used by millions of applications
2. **Adaptive**: Configurable cost factor (we use 12)
3. **Salt Included**: Automatic salt generation and storage
4. **Slow by Design**: Prevents brute force attacks
5. **Python Support**: Excellent library (`bcrypt` package)
6. **Well-Tested**: Proven security over decades

**Alternatives Considered**:
- ❌ **Argon2**: Newer but less ecosystem support
- ❌ **scrypt**: Good but more complex configuration
- ❌ **PBKDF2**: Older, less secure than bcrypt
- ❌ **SHA-256**: Not suitable for passwords (too fast)

### JWT Library: PyJWT 2.8.0

**Why PyJWT?**
1. **Standard**: Implements RFC 7519 (JSON Web Tokens)
2. **Simple API**: Easy encode/decode functions
3. **Algorithm Support**: HS256, RS256, etc.
4. **Expiration Handling**: Built-in exp claim validation
5. **Widely Used**: 5000+ stars on GitHub
6. **Python 3.7+**: Modern Python features
7. **Type Hints**: Better IDE support

**Token Configuration**:
- Algorithm: HS256 (symmetric, simpler for single backend)
- Expiration: 7 days default, 24 hours without "remember me"
- Claims: user_id, email, iat (issued at), exp (expiration)
- Secret: 256-bit random string from environment

### Frontend: React 18 + TypeScript

**Why React + TypeScript?** (Already in use)
1. **Consistency**: Docusaurus uses React
2. **Context API**: Perfect for global auth state
3. **Type Safety**: Catch errors at compile time
4. **Component Reusability**: Login, Signup, Profile components
5. **Hooks**: useState, useEffect, useContext for auth logic
6. **Testing**: React Testing Library for component tests

**Auth Libraries**:
- `axios`: HTTP client for API requests
- `react-router`: Navigation and protected routes
- `react-hook-form`: Form validation and state management
- `react-hot-toast`: User notifications

### HTTP Client: Axios 1.6.0

**Why Axios?**
1. **Interceptors**: Automatic JWT token attachment to requests
2. **Error Handling**: Unified error handling across app
3. **Promise-Based**: Works well with async/await
4. **Request/Response Transformation**: Easy JSON handling
5. **Timeout Support**: Prevent hanging requests
6. **Browser & Node**: Works in both environments

**Auth Configuration**:
```typescript
// Automatically add JWT to all requests
axios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Architecture Decisions

### Authentication Strategy: JWT with httpOnly Cookies

**Why JWT?**
1. **Stateless**: No server-side session storage needed
2. **Scalable**: Works across multiple backend instances
3. **Portable**: Can be used by other services (chatbot, personalization)
4. **Standard**: Industry-wide adoption
5. **Payload**: Can include user metadata (id, email, role)

**Why httpOnly Cookies?**
1. **XSS Protection**: JavaScript cannot access token
2. **Automatic**: Browser sends cookie with every request
3. **Secure Flag**: HTTPS-only in production
4. **SameSite**: CSRF protection
5. **Domain Control**: Restrict to specific domain

**Alternative Considered**:
- ❌ **localStorage**: Vulnerable to XSS attacks
- ❌ **sessionStorage**: Lost on tab close
- ❌ **Server-side sessions**: Doesn't scale, requires Redis/Memcached

### Database Schema Design: Normalized

**Why Normalized?**
1. **Data Integrity**: Foreign keys enforce relationships
2. **Update Efficiency**: Change user info in one place
3. **Query Flexibility**: Join tables for complex queries
4. **Storage Efficiency**: No duplicate data
5. **Scalability**: Easier to add new profile fields

**Schema**:
```
users (1) ←→ (1) user_profiles
users (1) ←→ (many) sessions
```

**Alternatives Considered**:
- ❌ **Single Table**: Harder to maintain, lots of NULL values
- ❌ **Denormalized**: Duplicate data, update anomalies
- ❌ **NoSQL**: Less suitable for relational user data

### Password Policy: Balanced Security

**Requirements**:
- Minimum 8 characters
- At least 1 letter (a-z, A-Z)
- At least 1 number (0-9)
- Optional: Special characters (encouraged but not required)

**Why These Rules?**
1. **User-Friendly**: Not overly restrictive
2. **Secure Enough**: Prevents common passwords like "password"
3. **Entropy**: 8+ chars with mixed types = high entropy
4. **Compliance**: Meets most education platform standards
5. **Balance**: Security vs user frustration

**Alternatives Considered**:
- ❌ **Longer (12+)**: Too restrictive for students
- ❌ **Required Special Chars**: Frustrating, users add "!" at end
- ❌ **No Requirements**: Too weak, allows "12345678"
- ❌ **Dictionary Check**: Complex to implement, slow

### Rate Limiting: Progressive Lockout

**Strategy**:
1. **Per IP**: 5 login attempts per minute per IP address
2. **Per Account**: 5 failed attempts = 15-minute lockout
3. **Exponential Backoff**: 2nd lockout = 30 min, 3rd = 1 hour
4. **Reset on Success**: Counter resets after successful login

**Why This Approach?**
1. **Prevents Brute Force**: 5 attempts not enough to guess passwords
2. **User-Friendly**: Legitimate users won't hit limit normally
3. **Progressive**: Repeated attacks face longer lockouts
4. **IP-Based**: Stops distributed attacks
5. **Account-Based**: Protects specific accounts

**Implementation**:
- Store `failed_login_attempts` and `locked_until` in users table
- Check lockout before validating password
- Increment counter on failed login
- Reset counter on successful login

## Implementation Phases

### Phase 1: Database Setup (Day 1)
**Goal**: Set up Neon Postgres database with schema

**Tasks**:
1. Sign up for Neon account
2. Create database project
3. Get connection string
4. Create `users` table
5. Create `user_profiles` table
6. Create `sessions` table (optional)
7. Create indexes
8. Test connection from FastAPI

**Deliverables**:
- Neon database created
- Schema migrated
- Connection string in `.env`
- Test script verifies connectivity

**Validation**:
- Can connect to database from Python
- Can insert/query test user
- Indexes created successfully
- Foreign keys work correctly

### Phase 2: Backend Auth Logic (Days 2-3)
**Goal**: Implement core authentication functions

**Tasks**:
1. Install dependencies (better-auth, bcrypt, pyjwt, psycopg2)
2. Create `auth.py` module
3. Implement `hash_password()`
4. Implement `verify_password()`
5. Implement `create_token()`
6. Implement `verify_token()`
7. Create Pydantic models (SignupRequest, LoginRequest, User)
8. Write unit tests for auth functions

**Deliverables**:
- `backend/auth.py` with all auth functions
- `backend/models.py` with Pydantic models
- Unit tests passing (90%+ coverage)

**Validation**:
- Password hashing works (can't reverse)
- Password verification works (same password matches)
- JWT tokens generate correctly
- JWT tokens validate correctly
- Expired tokens rejected

### Phase 3: Backend API Endpoints (Days 4-5)
**Goal**: Create FastAPI endpoints for auth operations

**Tasks**:
1. Create `backend/routers/auth.py`
2. Implement `POST /api/auth/signup`
3. Implement `POST /api/auth/login`
4. Implement `GET /api/auth/me`
5. Implement `PUT /api/auth/profile`
6. Implement `POST /api/auth/logout`
7. Create middleware for JWT verification
8. Add CORS configuration
9. Add rate limiting
10. Write integration tests

**Deliverables**:
- 5 auth endpoints working
- Swagger docs at `/docs`
- Middleware protects routes
- Integration tests passing

**Validation**:
- Can signup new user
- Can login with correct credentials
- Can't login with wrong password
- Protected routes require valid token
- Rate limiting works (429 after 5 requests)
- CORS allows frontend domain

### Phase 4: Frontend Auth Components (Days 6-7)
**Goal**: Create React components for authentication UI

**Tasks**:
1. Create `src/components/AuthProvider.tsx`
2. Create `src/components/Login.tsx`
3. Create `src/components/Signup.tsx`
4. Create `src/components/Profile.tsx`
5. Create `src/components/ProtectedRoute.tsx`
6. Implement auth context (user, login, signup, logout)
7. Implement form validation
8. Add loading states and error handling
9. Style components with CSS modules
10. Write component tests

**Deliverables**:
- 5 auth components
- Auth context working
- Forms validated
- Components tested

**Validation**:
- Can signup from UI
- Can login from UI
- Can logout from UI
- Can view/edit profile
- Protected routes redirect to login
- Error messages clear and helpful

### Phase 5: Integration & Testing (Days 8-9)
**Goal**: Connect frontend and backend, test end-to-end

**Tasks**:
1. Configure axios with auth interceptors
2. Connect AuthProvider to backend API
3. Test signup flow
4. Test login flow
5. Test profile update flow
6. Test logout flow
7. Test session persistence
8. Test token refresh
9. Test error scenarios
10. Fix bugs

**Deliverables**:
- Frontend and backend fully integrated
- All auth flows working
- E2E tests passing
- Bug fixes deployed

**Validation**:
- Signup creates user in database
- Login returns JWT token
- Token persists across page reloads
- Profile updates save to database
- Logout clears session
- Demo account works

### Phase 6: Security Hardening (Day 10)
**Goal**: Ensure production-ready security

**Tasks**:
1. Verify password hashing strength (cost factor 12)
2. Verify JWT secret is secure (256-bit random)
3. Enable httpOnly cookies in production
4. Enable secure flag (HTTPS-only)
5. Configure SameSite attribute
6. Verify CORS configuration
7. Verify rate limiting
8. Verify SQL injection prevention
9. Verify XSS prevention
10. Security audit with OWASP checklist

**Deliverables**:
- Security audit report
- All vulnerabilities fixed
- Production configuration ready

**Validation**:
- Passes OWASP security checklist
- Penetration test shows no vulnerabilities
- Password hashes can't be cracked
- JWT tokens can't be forged
- SQL injection attempts blocked
- XSS attempts blocked

## Data Flow Diagrams

### Signup Flow
```
┌─────────┐                                                  
│  User   │                                                  
└────┬────┘                                                  
     │                                                       
     │ 1. Fill signup form                                  
     │    (email, password, name, profile)                  
     │                                                       
     ▼                                                       
┌─────────────────┐                                         
│  Signup.tsx     │                                         
│  - Validate     │                                         
│  - Submit       │                                         
└────┬────────────┘                                         
     │                                                       
     │ 2. POST /api/auth/signup                            
     │    { email, password, name, ... }                   
     │                                                       
     ▼                                                       
┌─────────────────────────────────────┐                    
│  Backend: POST /api/auth/signup     │                    
│  1. Validate input                  │                    
│  2. Check email not exists          │                    
│  3. Hash password (bcrypt)          │                    
│  4. Insert user record              │                    
│  5. Insert profile record           │                    
│  6. Generate JWT token              │                    
│  7. Return user + token             │                    
└────┬────────────────────────────────┘                    
     │                                                       
     │ 3. Response: { user, token }                        
     │                                                       
     ▼                                                       
┌─────────────────┐                                         
│  AuthProvider   │                                         
│  - Set user     │                                         
│  - Store token  │                                         
│  - Navigate     │                                         
└────┬────────────┘                                         
     │                                                       
     │ 4. Redirect to dashboard                            
     │    or suggested module                               
     │                                                       
     ▼                                                       
┌─────────┐                                                  
│  User   │ (Logged in)                                     
└─────────┘                                                  
```

### Login Flow
```
┌─────────┐                                                  
│  User   │                                                  
└────┬────┘                                                  
     │                                                       
     │ 1. Enter email & password                           
     │                                                       
     ▼                                                       
┌─────────────────┐                                         
│  Login.tsx      │                                         
│  - Validate     │                                         
│  - Submit       │                                         
└────┬────────────┘                                         
     │                                                       
     │ 2. POST /api/auth/login                             
     │    { email, password }                              
     │                                                       
     ▼                                                       
┌─────────────────────────────────────┐                    
│  Backend: POST /api/auth/login      │                    
│  1. Find user by email              │                    
│  2. Check account not locked        │                    
│  3. Verify password (bcrypt)        │                    
│  4. Update last_login               │                    
│  5. Reset failed_attempts to 0      │                    
│  6. Generate JWT token              │                    
│  7. Return user + token             │                    
└────┬────────────────────────────────┘                    
     │                                                       
     │ 3. Response: { user, token }                        
     │                                                       
     ▼                                                       
┌─────────────────┐                                         
│  AuthProvider   │                                         
│  - Set user     │                                         
│  - Store token  │                                         
│  - Navigate     │                                         
└────┬────────────┘                                         
     │                                                       
     │ 4. Redirect to previous page                        
     │    or dashboard                                      
     │                                                       
     ▼                                                       
┌─────────┐                                                  
│  User   │ (Logged in)                                     
└─────────┘                                                  
```

### Protected Route Access
```
┌─────────┐                                                  
│  User   │                                                  
└────┬────┘                                                  
     │                                                       
     │ 1. Navigate to /profile                             
     │                                                       
     ▼                                                       
┌─────────────────┐                                         
│ ProtectedRoute  │                                         
│  - Check auth   │                                         
└────┬────────────┘                                         
     │                                                       
     │ 2. Is user logged in?                               
     │                                                       
     ├───► NO ───┐                                          
     │           │ 3. Redirect to /login                    
     │           └─────────────────────────►               
     │                                                       
     └───► YES                                              
           │                                                 
           │ 4. GET /api/auth/me                           
           │    Authorization: Bearer <token>              
           │                                                 
           ▼                                                 
    ┌─────────────────────────────────────┐               
    │  Backend: GET /api/auth/me          │               
    │  1. Extract token from header       │               
    │  2. Verify JWT signature            │               
    │  3. Check expiration                │               
    │  4. Query user from database        │               
    │  5. Return user object              │               
    └────┬────────────────────────────────┘               
         │                                                   
         │ 5. Response: { user }                          
         │                                                   
         ▼                                                   
    ┌─────────────────┐                                    
    │  Profile.tsx    │                                    
    │  - Display user │                                    
    │  - Edit form    │                                    
    └─────────────────┘                                    
```

### Token Refresh Flow
```
┌─────────┐                                                  
│  User   │ (Has token expiring soon)                       
└────┬────┘                                                  
     │                                                       
     │ 1. Page load / navigation                           
     │                                                       
     ▼                                                       
┌─────────────────┐                                         
│  AuthProvider   │                                         
│  useEffect()    │                                         
└────┬────────────┘                                         
     │                                                       
     │ 2. Check token expiration                           
     │    exp < now + 24 hours?                            
     │                                                       
     ├───► NO ───┐                                          
     │           │ Token still valid, do nothing            
     │           └────────────────────────►                
     │                                                       
     └───► YES                                              
           │                                                 
           │ 3. GET /api/auth/me                           
           │    Authorization: Bearer <old_token>          
           │                                                 
           ▼                                                 
    ┌─────────────────────────────────────┐               
    │  Backend: GET /api/auth/me          │               
    │  1. Verify old token (even if exp)  │               
    │  2. Query user                      │               
    │  3. Generate NEW token              │               
    │  4. Return user + new_token         │               
    └────┬────────────────────────────────┘               
         │                                                   
         │ 4. Response: { user, token }                   
         │                                                   
         ▼                                                   
    ┌─────────────────┐                                    
    │  AuthProvider   │                                    
    │  - Update token │                                    
    │  - Keep user    │                                    
    └─────────────────┘                                    
         │                                                   
         │ 5. Continue using app                          
         │    with refreshed token                         
         │                                                   
         ▼                                                   
    ┌─────────┐                                            
    │  User   │ (Seamless, no interruption)                
    └─────────┘                                            
```

## Database Schema

### Complete SQL Schema
```sql
-- Users table
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
    locked_until TIMESTAMP,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT name_length CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 50)
);

-- User profiles table
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    programming_experience VARCHAR(20) DEFAULT 'beginner',
    robotics_background VARCHAR(20) DEFAULT 'none',
    hardware_access VARCHAR(30) DEFAULT 'simulation_only',
    completed_modules JSONB DEFAULT '[]',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT prog_exp_values CHECK (
        programming_experience IN ('beginner', 'intermediate', 'advanced')
    ),
    CONSTRAINT robot_bg_values CHECK (
        robotics_background IN ('none', 'hobby', 'academic', 'professional')
    ),
    CONSTRAINT hw_access_values CHECK (
        hardware_access IN ('simulation_only', 'basic_kit', 'full_kit', 'custom_setup')
    )
);

-- Sessions table (optional, for audit trail)
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_revoked BOOLEAN DEFAULT FALSE,
    CONSTRAINT expires_future CHECK (expires_at > created_at)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_is_revoked ON sessions(is_revoked);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo account
INSERT INTO users (email, password_hash, name, last_login)
VALUES (
    'teacher@giaic.com',
    -- Password: Teacher@123 (hashed with bcrypt cost 12)
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5oPY3t0i1BjEu',
    'GIAIC Teacher',
    NOW()
);

INSERT INTO user_profiles (user_id, programming_experience, robotics_background, hardware_access)
VALUES (
    (SELECT id FROM users WHERE email = 'teacher@giaic.com'),
    'advanced',
    'professional',
    'full_kit'
);
```

## Environment Configuration

### Backend `.env`
```bash
# Database
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
NEON_HOST=host.neon.tech
NEON_DATABASE=dbname
NEON_USER=user
NEON_PASSWORD=password

# JWT
JWT_SECRET=your-256-bit-secret-here-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Rate Limiting
RATE_LIMIT_PER_MINUTE=5
LOCKOUT_DURATION_MINUTES=15

# Server
PORT=8000
HOST=0.0.0.0
```

### Frontend `.env`
```bash
# API
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000

# Demo Account (dev only, remove in production)
REACT_APP_DEMO_EMAIL=teacher@giaic.com
REACT_APP_DEMO_PASSWORD=Teacher@123
```

## Testing Strategy

### Unit Tests
**Backend** (`pytest`):
- `test_hash_password()`: Verify bcrypt hashing
- `test_verify_password()`: Verify password verification
- `test_create_token()`: Verify JWT generation
- `test_verify_token()`: Verify JWT validation
- `test_expired_token()`: Verify expired token rejected
- `test_invalid_token()`: Verify invalid signature rejected

**Frontend** (`jest` + `@testing-library/react`):
- `AuthProvider.test.tsx`: Context state management
- `Login.test.tsx`: Form validation and submission
- `Signup.test.tsx`: Multi-step form flow
- `Profile.test.tsx`: Display and edit functionality
- `ProtectedRoute.test.tsx`: Redirect logic

### Integration Tests
**Backend** (`pytest` + `TestClient`):
- `test_signup_success()`: Complete signup flow
- `test_signup_duplicate_email()`: Duplicate email rejected
- `test_login_success()`: Login with correct credentials
- `test_login_wrong_password()`: Wrong password rejected
- `test_login_lockout()`: 5 failed attempts = lockout
- `test_get_me_authenticated()`: Protected route with token
- `test_get_me_unauthenticated()`: 401 without token
- `test_update_profile()`: Profile update saves correctly

### End-to-End Tests
**Playwright/Cypress**:
- `signup_flow.spec.ts`: Complete signup from UI
- `login_flow.spec.ts`: Login, navigate, logout
- `profile_flow.spec.ts`: View and edit profile
- `session_persistence.spec.ts`: Token persists on reload
- `protected_route.spec.ts`: Redirect to login when unauthenticated

### Security Tests
**Manual/Automated**:
- SQL injection attempts (parameterized queries prevent)
- XSS attempts (React escapes by default)
- CSRF attempts (SameSite cookies prevent)
- Brute force attempts (rate limiting prevents)
- Token forgery (JWT signature verification prevents)

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (unit, integration, E2E)
- [ ] Security audit completed
- [ ] Environment variables configured
- [ ] Database migrated on production
- [ ] Demo account created
- [ ] CORS configured for production domain
- [ ] JWT secret is cryptographically secure
- [ ] Password hashing cost factor set to 12
- [ ] Rate limiting enabled
- [ ] Logging configured (no sensitive data)

### Production Configuration
- [ ] HTTPS enabled (Let's Encrypt)
- [ ] httpOnly cookies enabled
- [ ] Secure flag enabled
- [ ] SameSite=Strict enabled
- [ ] Database backups scheduled
- [ ] Monitoring set up (Sentry, Datadog)
- [ ] Health check endpoint working
- [ ] Error tracking configured

### Post-Deployment
- [ ] Smoke tests passed
- [ ] Demo account login works
- [ ] Signup flow works
- [ ] Login flow works
- [ ] Profile update works
- [ ] Protected routes work
- [ ] Token refresh works
- [ ] Performance acceptable (< 2s signup, < 1s login)

## Cost Estimation

### Neon Postgres (Free Tier)
- **Storage**: 10GB (enough for 100K+ users)
- **Compute**: 100 hours/month (auto-suspend saves cost)
- **Estimated Cost**: $0/month (within free tier)

### Better-Auth (Open Source)
- **Library**: Free, no licensing fees
- **Estimated Cost**: $0/month

### FastAPI (Self-Hosted)
- **Hosting**: Railway/Render free tier or $7/month
- **Estimated Cost**: $0-7/month

### Total Monthly Cost: $0-7

## Timeline

| Phase | Duration | Days |
|-------|----------|------|
| Database Setup | 1 day | Day 1 |
| Backend Auth Logic | 2 days | Days 2-3 |
| Backend API Endpoints | 2 days | Days 4-5 |
| Frontend Components | 2 days | Days 6-7 |
| Integration & Testing | 2 days | Days 8-9 |
| Security Hardening | 1 day | Day 10 |
| **Total** | **10 days** | **2 weeks** |

**Team**: 1-2 developers
**Sprint Length**: 2-week sprint
**Deployment**: End of sprint
