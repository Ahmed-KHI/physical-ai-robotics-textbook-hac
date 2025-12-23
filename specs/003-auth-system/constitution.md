# Constitution: Better-Auth Authentication System

## Feature Purpose
Provide a secure, modern authentication system using Better-Auth 1.4.5 that manages user identity, session management, and personalized user profiles to enable adaptive learning experiences and track student progress throughout the Physical AI & Robotics curriculum.

## Core Principles

### 1. Security & Privacy
- **Password Security**: Bcrypt hashing with salt, minimum 8 characters, complexity requirements
- **Session Management**: Secure JWT tokens with 7-day expiration, httpOnly cookies
- **Database Security**: Neon Postgres with SSL/TLS encryption, connection pooling
- **API Key Protection**: All sensitive credentials in backend environment variables only
- **Input Validation**: Sanitize all user inputs, prevent SQL injection and XSS
- **CORS Configuration**: Strict origin validation, only allow authorized domains
- **Rate Limiting**: Prevent brute force attacks (5 failed attempts = 15-minute lockout)
- **No PII Leakage**: Never log passwords or sensitive user data

### 2. User Experience
- **Fast Authentication**: Login/signup < 2 seconds response time
- **Clear Feedback**: Informative error messages without exposing security details
- **Persistent Sessions**: "Remember me" functionality with secure token refresh
- **Easy Registration**: Simple 3-step signup with profile questionnaire
- **Password Recovery**: Secure reset flow (future enhancement)
- **Profile Management**: Easy access to view/edit user information
- **Loading States**: Clear indicators during auth operations
- **Responsive Design**: Mobile-friendly login and profile pages

### 3. Technical Excellence
- **Modern Library**: Better-Auth 1.4.5 with built-in security best practices
- **Type Safety**: Full TypeScript support on frontend, Pydantic models on backend
- **Database Design**: Normalized schema, proper indexes, migration support
- **Modular Architecture**: Clean separation of auth logic, API, and UI
- **Error Handling**: Comprehensive try-catch blocks, graceful degradation
- **Testing**: Unit tests for auth flows, integration tests for API endpoints
- **Logging**: Audit trail for security events (login, logout, failed attempts)

### 4. Data Management
- **Profile Completeness**: Collect essential learning context during signup
- **Progressive Disclosure**: Optional fields can be completed later
- **Data Validation**: Server-side validation for all profile fields
- **Default Values**: Sensible defaults for optional fields
- **Update Flexibility**: Users can modify profiles after signup
- **Profile Schema**:
  - `email`: Unique identifier, validated format
  - `name`: Display name, 2-50 characters
  - `programming_experience`: beginner | intermediate | advanced
  - `robotics_background`: none | hobby | academic | professional
  - `hardware_access`: simulation_only | basic_kit | full_kit | custom_setup

### 5. Integration Standards
- **Backend API**: RESTful endpoints following FastAPI conventions
- **Frontend Context**: React Context API for global auth state
- **Token Management**: Automatic refresh, secure storage, cleanup on logout
- **Protected Routes**: HOC/wrapper for authenticated-only pages
- **Personalization Bridge**: Profile data available to recommendation engine
- **Database Connection**: Connection pooling, prepared statements, transactions

## Implementation Guidelines

### Authentication Flow
1. **Signup**:
   - User submits email, password, name
   - Backend validates input (email format, password strength)
   - Check for duplicate email
   - Hash password with bcrypt
   - Create user record in Postgres
   - Create profile questionnaire record
   - Generate JWT token
   - Set httpOnly cookie
   - Return user object (no password)

2. **Login**:
   - User submits email, password
   - Backend retrieves user by email
   - Verify password against hash
   - Check account status (not locked)
   - Update last_login timestamp
   - Generate JWT token
   - Set httpOnly cookie
   - Return user object with profile

3. **Session Validation**:
   - Extract JWT from cookie on protected routes
   - Verify token signature and expiration
   - Retrieve user from database
   - Attach user object to request context
   - Proceed with authorized request

4. **Logout**:
   - Clear httpOnly cookie
   - Optional: Invalidate token in database (blacklist)
   - Clear frontend auth state
   - Redirect to login

### Profile Questionnaire
1. **During Signup** (Step 2 of 3):
   - Display form with 3 key questions
   - Provide clear descriptions for each option
   - Use radio buttons for single-choice fields
   - Allow "skip for now" option (sets defaults)
   - Validate selections before proceeding

2. **After Signup** (Step 3 of 3):
   - Show personalized welcome message
   - Display recommended starting module
   - Offer to customize settings
   - Link to profile page for updates

3. **Profile Updates**:
   - Accessible from user menu/avatar
   - Show current values pre-filled
   - Allow modification of any field
   - Re-run personalization on save
   - Confirm changes with toast notification

### Frontend Components
1. **AuthProvider.tsx**:
   - Context provider wrapping entire app
   - Manages auth state (user, loading, error)
   - Provides login, signup, logout functions
   - Handles token refresh
   - Persists state to localStorage (non-sensitive)

2. **Login.tsx**:
   - Clean, centered form design
   - Email and password fields
   - "Remember me" checkbox
   - Error message display
   - Link to signup page
   - Demo credentials pre-filled (dev mode)

3. **Signup.tsx**:
   - Multi-step wizard (credentials → profile → welcome)
   - Progress indicator (1 of 3, 2 of 3, 3 of 3)
   - Inline validation with helpful messages
   - Password strength meter
   - Terms of service checkbox

4. **ProtectedRoute.tsx**:
   - HOC wrapping protected pages
   - Redirects to login if not authenticated
   - Shows loading spinner during auth check
   - Passes user object to child components

### Backend Endpoints
```python
POST /api/auth/signup
- Body: { email, password, name, programming_experience, robotics_background, hardware_access }
- Response: { user, token }

POST /api/auth/login
- Body: { email, password }
- Response: { user, token }

GET /api/auth/me
- Headers: Authorization: Bearer <token>
- Response: { user }

PUT /api/auth/profile
- Headers: Authorization: Bearer <token>
- Body: { name?, programming_experience?, robotics_background?, hardware_access? }
- Response: { user }

POST /api/auth/logout
- Headers: Authorization: Bearer <token>
- Response: { message: "Logged out successfully" }
```

### Database Schema
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

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### Error Handling
1. **Validation Errors**:
   - Email format invalid → "Please enter a valid email address"
   - Password too short → "Password must be at least 8 characters"
   - Email already exists → "An account with this email already exists"

2. **Authentication Errors**:
   - Wrong password → "Invalid email or password"
   - Account locked → "Too many failed attempts. Try again in 15 minutes."
   - Session expired → Redirect to login, show "Your session has expired"

3. **Server Errors**:
   - Database connection failed → "Service unavailable. Please try again."
   - Token generation failed → "Authentication error. Please try again."
   - Network timeout → "Request timed out. Please check your connection."

## Quality Checklist

### Before Committing
- [ ] Password hashing works correctly (bcrypt)
- [ ] JWT tokens generate and validate properly
- [ ] All auth endpoints return appropriate status codes
- [ ] Validation errors provide helpful messages
- [ ] No passwords or tokens in console logs
- [ ] AuthProvider context updates correctly
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Profile questionnaire saves to database
- [ ] Demo account works (teacher@giaic.com / Teacher@123)
- [ ] TypeScript types defined for all auth models
- [ ] No ESLint errors in auth components

### Before Deployment
- [ ] Environment variables configured in production
- [ ] Neon Postgres database created and migrated
- [ ] Database indexes created for performance
- [ ] CORS configured for production frontend domain
- [ ] Rate limiting enabled on auth endpoints
- [ ] JWT secret is cryptographically secure (32+ chars)
- [ ] Session expiration set appropriately (7 days)
- [ ] All auth flows tested end-to-end
- [ ] Failed login lockout mechanism tested
- [ ] Token refresh works seamlessly
- [ ] Password requirements enforced
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] SQL injection prevention validated
- [ ] XSS prevention validated

## Success Metrics

### Security
- Zero password storage vulnerabilities
- All passwords hashed with bcrypt (cost factor 12)
- JWT tokens use HS256 with 256-bit secret
- No sensitive data in frontend localStorage
- Failed login lockout after 5 attempts
- SQL injection attempts blocked 100%

### Performance
- Signup completes in < 2 seconds
- Login completes in < 1 second
- Profile update completes in < 1 second
- Token validation < 50ms
- Database queries < 100ms

### User Experience
- Registration success rate > 90%
- Login success rate > 95% (excluding wrong password)
- Profile questionnaire completion > 80%
- Session persistence across page reloads
- Clear error messages for all failure modes

### Data Quality
- All required profile fields collected during signup
- Profile data available for personalization engine
- User progress tracked accurately
- No duplicate user records
- Audit trail for all security events

## Demo Account
For testing and demonstration purposes:
- **Email**: teacher@giaic.com
- **Password**: Teacher@123
- **Profile**:
  - Name: GIAIC Teacher
  - Programming Experience: advanced
  - Robotics Background: professional
  - Hardware Access: full_kit

## Future Enhancements
- Password reset via email
- Email verification during signup
- Two-factor authentication (2FA)
- Social login (Google, GitHub)
- OAuth2 for third-party integrations
- Session management dashboard (view all active sessions)
- Account deletion with data export
- Audit log viewer for users
- Admin panel for user management
