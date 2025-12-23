# Feature Specification: RAG Chatbot

## Overview
An intelligent, context-aware chatbot powered by Retrieval Augmented Generation (RAG) that provides instant answers to student questions by leveraging the entire textbook content, course materials, and conversation history.

## Problem Statement
Students face challenges when learning:
- **Question Overload**: Teachers can't answer every student individually
- **Delayed Responses**: Questions asked after hours go unanswered
- **Search Limitations**: Built-in search only finds keywords, not concepts
- **Context Loss**: Students don't know which section contains answers
- **Repetitive Questions**: Same questions asked repeatedly
- **Textbook Navigation**: Hard to find specific information quickly

Traditional solutions fall short:
- Basic search returns too many or irrelevant results
- FAQ sections become outdated quickly
- Static help docs don't understand natural language
- Email/forum responses take hours or days
- Students give up when they can't find answers immediately

## Solution
RAG-powered chatbot providing:
- **Instant Answers**: Responses in 2-3 seconds
- **Context-Aware**: Uses entire textbook as knowledge base
- **Conversational**: Maintains conversation history
- **Smart Retrieval**: Finds relevant content automatically
- **Text Selection Support**: Answer questions about highlighted text
- **Always Available**: 24/7 assistance
- **Accurate Citations**: Links back to source material

## User Stories

### As a Student
- I want to ask questions in natural language and get instant answers
- I want the chatbot to understand which section I'm reading
- I want to highlight text and ask "explain this" or "give me an example"
- I want to follow up with clarifying questions
- I want links to relevant textbook sections for deeper learning
- I want code examples when asking programming questions
- I want to access the chatbot from any page without losing context

### As a Teacher
- I want common questions answered automatically
- I want students to find answers independently
- I want the chatbot to cite actual course material
- I want to see analytics on what students ask
- I want accurate answers based on our curriculum
- I want to reduce repetitive question volume

### As a Developer
- I want to add the chatbot without disrupting existing UI
- I want to update the knowledge base automatically
- I want to monitor chatbot performance
- I want to handle errors gracefully
- I want to control costs and rate limits

## Core Features

### 1. Intelligent Question Answering
**Capabilities**:
- Natural language understanding via GPT-3.5-turbo
- Context retrieval from vector database (Qdrant Cloud)
- Top 5 most relevant chunks per query
- Semantic search using OpenAI ada-002 embeddings
- Response generation with RAG pipeline (LangChain)
- Citation of source material with page/section links

**Question Types Supported**:
- Conceptual: "What is Physical AI?"
- How-to: "How do I set up ROS2?"
- Comparison: "What's the difference between CNN and RNN?"
- Code help: "Show me an example of a PID controller"
- Troubleshooting: "Why isn't my robot moving?"
- Definition: "Define inverse kinematics"

### 2. Context Detection
**Text Selection Mode**:
- Detects when user highlights text on page
- Automatically includes selection in query context
- Pre-fills prompt with "Explain: [selected text]"
- Retrieves additional context around selection
- Provides deeper explanations with examples

**Page Context Awareness**:
- Knows which page/module user is viewing
- Prioritizes content from current section
- Uses page metadata for better retrieval
- Adjusts tone based on curriculum level (beginner vs advanced)

### 3. Conversation Management
**Features**:
- Maintains conversation history (last 10 messages)
- Follow-up questions use previous context
- "Can you explain that more simply?" works naturally
- "Give me an example" provides code samples
- Clear history button for new topics
- Session persistence (browser storage)

**Conversation Flow**:
1. User asks initial question
2. Bot retrieves relevant content + generates answer
3. User asks follow-up (uses previous Q&A as context)
4. Bot understands reference ("that", "it", "this")
5. User can branch to new topic or continue thread

### 4. UI/UX Design
**Widget Positioning**:
- Fixed bottom-right corner
- Z-index above all content
- Expandable/collapsible
- Draggable (optional enhancement)
- Minimizes to small icon when collapsed

**Widget States**:
- **Collapsed**: Small circle icon (32px)
- **Expanded**: Full chat interface (400px × 600px)
- **Loading**: Animated spinner during retrieval
- **Error**: Friendly error message with retry option

**Interface Components**:
- Message list with scroll
- Text input field with send button
- Clear history button
- Close/minimize button
- Typing indicator while generating
- Markdown rendering for code blocks
- Copy button for code snippets
- Clickable source citations

**Responsive Behavior**:
- Mobile: Full screen overlay (100vw × 100vh)
- Tablet: Same as desktop (400px × 600px)
- Desktop: Fixed bottom-right widget

### 5. Knowledge Base Management
**Content Indexing**:
- Indexes all `.md` and `.mdx` files from `docs/` folder
- Chunks content into ~500 token segments
- Preserves code blocks intact (no splitting)
- Maintains document hierarchy (module > week > section)
- Extracts metadata (title, headings, module number)
- Creates embeddings with OpenAI ada-002

**Automatic Updates**:
- Re-index on content changes (via backend endpoint)
- Incremental updates (only changed files)
- Version tracking to avoid duplicate indexing
- Build-time indexing option

**Document Processing**:
```
Markdown → Clean Text → Chunk (500 tokens) → Embed (ada-002) → Store (Qdrant)
```

### 6. Backend Architecture
**FastAPI Server**:
- `/api/chat` - POST endpoint for queries
- `/api/index` - POST endpoint to trigger indexing
- `/api/health` - GET endpoint for health check
- CORS enabled for frontend communication
- Rate limiting (10 requests/minute/user)
- Error handling and logging

**LangChain RAG Pipeline**:
1. Query embedding (OpenAI ada-002)
2. Vector search in Qdrant (top 5 results)
3. Prompt construction (query + context + history)
4. LLM generation (GPT-3.5-turbo)
5. Response formatting (markdown + citations)

**Environment Variables**:
```
OPENAI_API_KEY=<key>
QDRANT_URL=<cloud-url>
QDRANT_API_KEY=<key>
DOCS_PATH=../docs
```

## Technical Architecture

### Tech Stack
**Backend**:
- **FastAPI**: 0.109.0 (REST API framework)
- **LangChain**: 0.1.0 (RAG orchestration)
- **OpenAI**: 1.6.1 (Embeddings + LLM)
- **Qdrant Client**: 1.7.0 (Vector database)
- **Python**: 3.11+

**Frontend**:
- **React**: 19.0.0
- **TypeScript**: 5.7.2
- **Axios**: 1.6.5 (API calls)
- **React Markdown**: 9.0.1 (Render responses)
- **Prism**: Syntax highlighting

**Infrastructure**:
- **Qdrant Cloud**: Vector storage (free tier)
- **Vercel**: Frontend hosting
- **Railway/Render**: Backend hosting (free tier)

### System Architecture Diagram
```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Chatbot.tsx Component                             │ │
│  │  - Text selection detection                        │ │
│  │  - Message history UI                              │ │
│  │  - Input field + send button                       │ │
│  └───────────────┬───────────────────────────────────┘ │
└──────────────────┼──────────────────────────────────────┘
                   │ (POST /api/chat)
                   ↓
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend (Railway/Render)           │
│  ┌───────────────────────────────────────────────────┐ │
│  │  /api/chat Endpoint                                │ │
│  │  1. Receive query + history + context              │ │
│  │  2. Create embedding (OpenAI ada-002)              │ │
│  │  3. Query Qdrant for top 5 chunks                  │ │
│  │  4. Build prompt with context                      │ │
│  │  5. Call GPT-3.5-turbo                             │ │
│  │  6. Return response + citations                    │ │
│  └───────────────┬───────────────────────────────────┘ │
└──────────────────┼──────────────────────────────────────┘
                   │ 
        ┌──────────┴───────────┐
        ↓                      ↓
┌──────────────────┐  ┌──────────────────┐
│   OpenAI API     │  │  Qdrant Cloud    │
│  - ada-002       │  │  - Vector store  │
│  - gpt-3.5-turbo │  │  - 1536 dims     │
│  - Embeddings    │  │  - Cosine sim    │
│  - Generation    │  │  - ~2000 docs    │
└──────────────────┘  └──────────────────┘
```

### Data Flow

#### Chat Query Flow
1. **User Input**: User types question in chatbot
2. **Frontend**: `Chatbot.tsx` sends POST to `/api/chat`
3. **Backend Receives**: FastAPI parses query + history
4. **Embedding**: OpenAI creates query embedding (1536 dims)
5. **Vector Search**: Qdrant returns top 5 similar chunks
6. **Prompt Build**: Combine query + context + history
7. **LLM Call**: GPT-3.5-turbo generates response
8. **Response**: Backend returns JSON with answer + sources
9. **Frontend Render**: Display message with markdown + links
10. **History Update**: Add Q&A to conversation state

#### Indexing Flow
1. **Trigger**: Manual call to `/api/index` or build script
2. **File Reading**: Read all `.md`/`.mdx` from `docs/`
3. **Parsing**: Extract content, metadata, headings
4. **Chunking**: Split into ~500 token chunks
5. **Embedding**: Create embeddings for each chunk
6. **Storage**: Upsert vectors to Qdrant with metadata
7. **Verification**: Confirm successful indexing
8. **Log**: Record indexing stats (count, duration)

### API Specifications

#### POST /api/chat
**Request**:
```json
{
  "query": "What is Physical AI?",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"}
  ],
  "context": {
    "page": "/docs/module-1/week-1",
    "selectedText": ""
  }
}
```

**Response**:
```json
{
  "answer": "Physical AI refers to...",
  "sources": [
    {
      "title": "Introduction to Physical AI",
      "url": "/docs/module-1/week-1#physical-ai",
      "snippet": "Physical AI is the integration..."
    }
  ],
  "metadata": {
    "tokens": 450,
    "duration": 2.3,
    "model": "gpt-3.5-turbo"
  }
}
```

#### POST /api/index
**Request**:
```json
{
  "path": "../docs",
  "force": false
}
```

**Response**:
```json
{
  "status": "success",
  "indexed": 87,
  "duration": 45.2,
  "timestamp": "2025-12-23T10:30:00Z"
}
```

## Success Criteria

### Functional Requirements
✅ Chatbot responds to questions within 3 seconds
✅ Retrieves relevant context from textbook
✅ Maintains conversation history
✅ Detects and uses text selection
✅ Provides source citations with links
✅ Handles errors gracefully
✅ Works on mobile and desktop
✅ Widget can be opened/closed smoothly
✅ Markdown and code blocks render correctly

### Quality Requirements
✅ Answers are accurate and relevant (>90% user satisfaction)
✅ No hallucination of facts not in textbook
✅ Responses are concise (< 200 words typical)
✅ Code examples are syntactically correct
✅ Citations link to correct pages
✅ Conversation context maintained for 10 messages
✅ No duplicate or contradictory answers

### Performance Requirements
✅ Response time < 3 seconds (p95)
✅ Vector search < 200ms
✅ Embedding generation < 500ms
✅ LLM generation < 2 seconds
✅ UI interaction lag < 100ms
✅ Handles 10 concurrent users
✅ 99% uptime

### Cost Requirements
✅ < $0.02 per query (OpenAI costs)
✅ < $10/month total (free tiers where possible)
✅ Qdrant free tier sufficient (~2000 documents)
✅ Backend hosting free tier (Railway/Render)
✅ Monitoring and error budget defined

### Usability Requirements
✅ Intuitive UI, no tutorial needed
✅ Mobile-friendly interface
✅ Accessible (keyboard navigation, screen readers)
✅ Clear error messages
✅ Visible loading states
✅ Easy to clear conversation history

## Security & Privacy

### Data Protection
- No personal data stored
- Conversation history stored client-side only
- No user tracking or analytics
- API keys secured in environment variables
- CORS properly configured

### Rate Limiting
- 10 requests per minute per user
- Token limits enforced (max 4000 tokens/request)
- Abuse detection and blocking
- Graceful degradation under load

### Error Handling
- API key validation on startup
- Qdrant connection retry logic
- OpenAI fallback strategies
- User-friendly error messages
- Logging for debugging (no PII)

## Future Enhancements (Out of Scope)

### Phase 2 Features
- 🔮 Voice input/output
- 🔮 Multi-language support (Urdu translation)
- 🔮 Personalized responses based on user progress
- 🔮 Image understanding (diagram explanations)
- 🔮 Code execution in sandbox
- 🔮 Homework help mode
- 🔮 Teacher dashboard for analytics
- 🔮 Fine-tuned model on course data
- 🔮 Integration with LMS/gradebook

## Metrics & Monitoring

### Key Metrics
- **Usage**: Queries per day, unique users
- **Performance**: Response time, uptime
- **Quality**: User satisfaction (thumbs up/down)
- **Cost**: OpenAI spend, token usage
- **Errors**: Error rate, timeout rate
- **Engagement**: Messages per session, repeat users

### Monitoring
- Health check endpoint (`/api/health`)
- Error logging (FastAPI middleware)
- OpenAI usage tracking
- Qdrant connection status
- Response time distribution

### Success Indicators
- 50+ queries per day within first week
- 90% positive feedback rating
- < 3 second average response time
- < 1% error rate
- Students report finding answers faster
