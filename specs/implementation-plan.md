# Implementation Plan - Physical AI & Robotics Textbook

## Tech Stack Selection

### Frontend Stack
**Framework**: Docusaurus 3.9.2
- ✅ Built for documentation/textbook content
- ✅ React-based with TypeScript support
- ✅ Static site generation for performance
- ✅ Built-in search and navigation
- ✅ MDX support for interactive content
- ✅ Excellent SEO and accessibility

**UI Libraries**:
- React 19.0.0 (latest stable)
- Framer Motion 12.23.25 (animations)
- Radix UI (accessible components)
- Custom CSS modules

**Authentication Client**: Better-Auth 1.4.5
- Modern, secure auth solution
- Type-safe API
- Easy integration with React

### Backend Stack
**Framework**: FastAPI 0.115.6
- ✅ Modern Python web framework
- ✅ Automatic OpenAPI documentation
- ✅ Fast performance with async support
- ✅ Type hints for reliability
- ✅ Easy CORS configuration

**AI/ML Stack**:
- OpenAI GPT-3.5-turbo (cost-effective: $0.001/1K tokens)
- LangChain 0.3.14 (orchestration)
- Qdrant 1.12.1 (vector database)

**Database**: 
- Neon Postgres (user data, sessions)
- Qdrant Cloud (vector embeddings)

**Deployment**:
- Frontend: Vercel (auto-deploy, global CDN)
- Backend: Render (free tier, auto-deploy)

## Architecture Decisions

### Why Docusaurus?
1. **Purpose-Built**: Specifically designed for documentation sites
2. **Performance**: Static generation = fast load times
3. **Developer Experience**: Great tooling, hot reload, plugins
4. **Customization**: Full React access for custom features
5. **Community**: Large ecosystem, active maintenance

### Why GPT-3.5-turbo over GPT-4?
1. **Cost**: 20x cheaper ($0.001 vs $0.02 per 1K tokens)
2. **Speed**: Faster response times
3. **Sufficient**: Handles textbook QA well
4. **Budget-Friendly**: Stay under $5/month for hackathon

### Why Qdrant over Pinecone/Weaviate?
1. **Free Tier**: 1GB storage free (enough for textbook)
2. **Performance**: Fast similarity search
3. **Easy Setup**: Cloud-hosted, minimal config
4. **API-First**: Simple REST API

### Why Better-Auth?
1. **Modern**: Built for current web standards
2. **Type-Safe**: Full TypeScript support
3. **Flexible**: Easy to customize
4. **Secure**: Industry-standard practices

## System Architecture

```
Frontend Architecture:
├── docs/                    # Markdown textbook content
│   ├── module-1/           # Week 1: Introduction
│   ├── module-2/           # Weeks 2-3: Fundamentals
│   ├── module-3/           # Weeks 4-7: AI/ML
│   └── module-4/           # Weeks 8-13: Advanced
├── src/
│   ├── components/
│   │   ├── Chatbot.tsx            # RAG chatbot widget
│   │   ├── TranslationButton.tsx  # Urdu translation
│   │   ├── PersonalizationButton.tsx # Adaptive learning
│   │   ├── AuthProvider.tsx       # Auth wrapper
│   │   └── Login.tsx              # Login modal
│   ├── theme/              # Docusaurus customizations
│   ├── pages/              # Custom pages
│   └── css/                # Global styles
├── static/                 # Images, assets
├── docusaurus.config.ts    # Docusaurus configuration
└── package.json

Backend Architecture:
├── main.py                 # FastAPI app, routes
├── rag.py                  # RAG system (LangChain + Qdrant)
├── database.py             # Postgres connection
├── index_content.py        # Index textbook to Qdrant
├── requirements.txt        # Python dependencies
└── .env                    # Environment variables
```

## Implementation Phases

### Phase 1: Core Textbook (✅ Complete)
- [x] Docusaurus setup and configuration
- [x] 13-week curriculum structure
- [x] Module 1: Introduction to Physical AI
- [x] Module 2: Robotics Fundamentals
- [x] Module 3: AI/ML for Robotics
- [x] Module 4: Advanced Applications
- [x] Custom styling and branding
- [x] Navigation and sidebar
- [x] Mobile responsive layout

### Phase 2: RAG Chatbot (✅ Complete)
- [x] FastAPI backend setup
- [x] OpenAI API integration
- [x] Qdrant vector database setup
- [x] Index textbook content to Qdrant
- [x] LangChain RAG implementation
- [x] Chatbot UI component
- [x] Text selection detection
- [x] Context-aware responses
- [x] Error handling and loading states
- [x] Deploy backend to Render

### Phase 3: Authentication (✅ Complete)
- [x] Better-Auth setup (client + server)
- [x] Neon Postgres database
- [x] User registration with profile questionnaire
- [x] Login/logout functionality
- [x] Session management
- [x] Demo account (teacher@giaic.com)
- [x] Protected routes
- [x] User profile display

### Phase 4: Adaptive Learning (✅ Complete)
- [x] User profile storage
- [x] Personalization API endpoint
- [x] Content adaptation logic
- [x] Profile-based content transformation
- [x] Personalization button UI
- [x] Level indicators
- [x] Hardware-specific examples

### Phase 5: Urdu Translation (✅ Complete)
- [x] Translation API endpoint
- [x] OpenAI translation integration
- [x] Translation button component
- [x] Markdown preservation
- [x] Loading states
- [x] Error handling
- [x] Toggle original/translated view

### Phase 6: Deployment & Optimization (✅ Complete)
- [x] Frontend: Vercel deployment
- [x] Backend: Render deployment
- [x] Environment variable configuration
- [x] CORS setup
- [x] Performance optimization
- [x] Keep backend warm (no cold starts)
- [x] SSL/HTTPS
- [x] Domain configuration

### Phase 7: Spec-Kit Integration (🚀 Current)
- [ ] Install Spec-Kit CLI
- [ ] Create project constitution
- [ ] Document feature specifications
- [ ] Create implementation plan
- [ ] Generate task breakdown
- [ ] Add Spec-Kit documentation
- [ ] Update README with Spec-Kit info

## Data Flow

### RAG Chatbot Flow
```
1. User types question → Chatbot.tsx
2. POST /api/chat/query → FastAPI backend
3. Embed query with OpenAI → Vector (1536 dims)
4. Query Qdrant → Top 5 similar chunks
5. Construct prompt with context → LangChain
6. Call GPT-3.5-turbo → Generate response
7. Return response → Display in chatbot
```

### Adaptive Learning Flow
```
1. User updates profile → AuthProvider.tsx
2. Store in Postgres → User preferences
3. Click personalize → PersonalizationButton.tsx
4. POST /api/personalize → FastAPI backend
5. Get user level → Query Postgres
6. Transform content → OpenAI with system prompt
7. Return adapted content → Replace page content
```

### Translation Flow
```
1. Click translate → TranslationButton.tsx
2. Extract page content → DOM traversal
3. POST /api/translate → FastAPI backend
4. Translate with OpenAI → Urdu output
5. Return translated text → Update page
6. Toggle button → Show original/translated
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### RAG Chatbot
- `POST /api/chat/query` - Ask question (RAG)
- `GET /api/chat/history` - Get conversation history

### Personalization
- `POST /api/personalize` - Transform content
- `GET /api/profile` - Get user profile

### Translation
- `POST /api/translate` - Translate to Urdu

### Health
- `GET /` - API status
- `GET /health` - Detailed health check

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    programming_experience VARCHAR(50),
    robotics_background VARCHAR(50),
    hardware_access VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(500) UNIQUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Qdrant Collections
- **textbook_content**: Vector embeddings of all chapters
  - Vector size: 1536 (OpenAI ada-002)
  - Payload: {text, chapter, section, title}

## Performance Targets

### Frontend
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

### Backend
- Health check response: < 100ms
- Chatbot response: < 5s (including OpenAI)
- Translation: < 10s (depends on content length)
- Personalization: < 8s

### Cost Targets
- OpenAI API: < $3/month
- Qdrant: Free tier (1GB)
- Neon Postgres: Free tier (512MB)
- Vercel: Free tier
- Render: Free tier + $5 uptime service

## Security Measures

1. **API Keys**: Stored in backend .env, never exposed to frontend
2. **CORS**: Whitelist only production domains
3. **Rate Limiting**: Prevent API abuse
4. **Input Validation**: Sanitize all user inputs
5. **SQL Injection**: Use parameterized queries
6. **XSS Protection**: Escape user-generated content
7. **HTTPS**: Enforce SSL on all connections
8. **Password Hashing**: bcrypt with salt

## Monitoring & Logging

### Frontend
- Vercel Analytics
- Console error tracking
- Performance metrics

### Backend
- FastAPI logging
- Error tracking
- API usage monitoring
- Uptime monitoring (UptimeRobot)

## Rollback Plan

If deployment fails:
1. Check Vercel/Render logs
2. Verify environment variables
3. Test API endpoints manually
4. Rollback to previous Git commit
5. Redeploy stable version

## Maintenance

### Weekly
- Check API costs
- Monitor error logs
- Review uptime metrics

### Monthly
- Update dependencies
- Backup database
- Review user feedback
- Add new content/features

### As Needed
- Scale backend if traffic increases
- Optimize expensive API calls
- Update AI models if better ones available
