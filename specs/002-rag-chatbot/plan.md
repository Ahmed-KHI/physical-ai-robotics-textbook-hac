# Implementation Plan: RAG Chatbot

## Tech Stack Selection

### Backend Framework: FastAPI 0.109.0

**Why FastAPI?**
1. **Performance**: Asynchronous by default, handles concurrent requests efficiently
2. **Type Safety**: Pydantic models for request/response validation
3. **Auto Documentation**: Built-in Swagger UI and OpenAPI specs
4. **Modern Python**: Async/await, Python 3.11+ features
5. **Easy Deployment**: Works well with Railway, Render, Docker
6. **Developer Experience**: Hot reload, excellent error messages
7. **Integration**: Works seamlessly with LangChain and async libraries

**Alternatives Considered**:
- ❌ **Flask**: No async support, slower for AI workloads
- ❌ **Django**: Overkill for API-only service, complex setup
- ❌ **Express.js**: Would require JS/TS, team knows Python better
- ❌ **FastAPI Serverless**: Cold starts problematic for AI models

### RAG Framework: LangChain 0.1.0

**Why LangChain?**
1. **Purpose-Built**: Designed specifically for RAG and LLM applications
2. **Abstraction**: Handles embeddings, vector stores, prompt templates
3. **Flexibility**: Easy to swap models, vector stores, or components
4. **Community**: Large ecosystem, active development, many examples
5. **Production-Ready**: Used by thousands of companies
6. **Memory Management**: Built-in conversation history handling
7. **Retrieval**: Optimized chunking and retrieval strategies

**Alternatives Considered**:
- ❌ **LlamaIndex**: Less flexible for custom pipelines
- ❌ **Haystack**: More complex, slower development
- ❌ **Custom RAG**: Too much work to replicate LangChain features
- ❌ **Semantic Kernel**: Microsoft-focused, less Python support

### LLM Provider: OpenAI GPT-3.5-turbo

**Why GPT-3.5-turbo?**
1. **Cost-Effective**: $0.0015/1K tokens (10x cheaper than GPT-4)
2. **Fast**: 1-2 second response times
3. **Quality**: Good enough for educational Q&A
4. **Context Window**: 16K tokens (sufficient for RAG)
5. **Stable API**: Mature, well-documented, reliable
6. **Function Calling**: Support for structured outputs

**Alternatives Considered**:
- ❌ **GPT-4**: Too expensive ($0.03/1K tokens), overkill
- ❌ **Claude**: No free tier, more expensive
- ❌ **Llama 2**: Requires GPU hosting, slower, more complex
- ❌ **Open-source models**: Hosting costs exceed API costs

### Embeddings: OpenAI text-embedding-ada-002

**Why ada-002?**
1. **Standard**: 1536 dimensions, industry standard
2. **Quality**: Excellent semantic search performance
3. **Cost**: $0.0001/1K tokens (very cheap)
4. **Speed**: 100-200ms per embedding
5. **Same Provider**: Simplifies billing and API management

**Alternatives Considered**:
- ❌ **Sentence Transformers**: Requires hosting, slower
- ❌ **Cohere**: More expensive, less ecosystem support
- ❌ **Custom models**: Training cost and complexity too high

### Vector Database: Qdrant Cloud

**Why Qdrant Cloud?**
1. **Free Tier**: 1GB storage, 1M vectors (~2000 documents)
2. **Performance**: Rust-based, extremely fast searches (<50ms)
3. **Cloud-Hosted**: No infrastructure management
4. **Scalability**: Easy upgrade path when needed
5. **Python Client**: Excellent SDK, async support
6. **Filtering**: Metadata filtering for contextual search
7. **REST API**: Direct HTTP access if needed

**Alternatives Considered**:
- ❌ **Pinecone**: Free tier too limited (1 index, 100K vectors)
- ❌ **Weaviate**: More complex setup, less generous free tier
- ❌ **Chroma**: Local-first, harder to deploy in production
- ❌ **FAISS**: No managed solution, would need self-hosting

### Frontend: React + TypeScript

**Why React/TypeScript?**
1. **Consistency**: Already using React for Docusaurus
2. **Type Safety**: Catch errors at compile time
3. **Component Reusability**: Easy to build chatbot widget
4. **Ecosystem**: Rich library support (axios, react-markdown)
5. **Team Knowledge**: Developers already familiar

## Architecture Decisions

### Architecture Pattern: RAG (Retrieval Augmented Generation)

**Why RAG over Fine-tuning?**
1. **No Training Required**: Use pre-trained models
2. **Always Up-to-date**: Content changes reflected immediately
3. **Cost-Effective**: No GPU training costs
4. **Interpretable**: Can see which chunks were retrieved
5. **Scalable**: Add documents without retraining
6. **Flexible**: Easy to adjust retrieval parameters

### Deployment: Separate Frontend + Backend

**Why Separate Services?**
1. **Independent Scaling**: Scale backend for AI workload separately
2. **Technology Flexibility**: Different runtimes (Node vs Python)
3. **Security**: API keys stay on backend only
4. **Cost Optimization**: Different hosting providers for each
5. **Development**: Teams can work independently

**Architecture**:
- **Frontend**: Vercel (static + React)
- **Backend**: Railway or Render (Python + FastAPI)
- **Vector DB**: Qdrant Cloud (managed)
- **Communication**: REST API over HTTPS

### Session Management: Client-Side Storage

**Why Client-Side?**
1. **Simplicity**: No user accounts or authentication needed
2. **Privacy**: No server-side conversation storage
3. **Cost**: No database for session management
4. **Performance**: Instant conversation history access
5. **Stateless Backend**: Backend doesn't track sessions

**Implementation**: `localStorage` for conversation history (last 10 messages)

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │              Docusaurus Site (Vercel CDN)                   ││
│  │                                                              ││
│  │  ┌─────────────────────────────────────────────────────┐  ││
│  │  │  Chatbot.tsx Component                               │  ││
│  │  │  ┌────────────────────────────────────────────────┐ │  ││
│  │  │  │  State Management                               │ │  ││
│  │  │  │  - messages: Message[]                          │ │  ││
│  │  │  │  - isOpen: boolean                              │ │  ││
│  │  │  │  - isLoading: boolean                           │ │  ││
│  │  │  │  - selectedText: string                         │ │  ││
│  │  │  └────────────────────────────────────────────────┘ │  ││
│  │  │  ┌────────────────────────────────────────────────┐ │  ││
│  │  │  │  Event Handlers                                 │ │  ││
│  │  │  │  - handleSend() → POST /api/chat                │ │  ││
│  │  │  │  - handleTextSelect() → detect selection        │ │  ││
│  │  │  │  - handleClear() → reset history                │ │  ││
│  │  │  └────────────────────────────────────────────────┘ │  ││
│  │  │  ┌────────────────────────────────────────────────┐ │  ││
│  │  │  │  UI Components                                  │ │  ││
│  │  │  │  - MessageList                                  │ │  ││
│  │  │  │  - InputField                                   │ │  ││
│  │  │  │  - ToggleButton                                 │ │  ││
│  │  │  │  - SourceCitation                               │ │  ││
│  │  │  └────────────────────────────────────────────────┘ │  ││
│  │  └─────────────────────────────────────────────────────┘  ││
│  │                                                              ││
│  │  localStorage: conversation_history                         ││
│  └────────────────────────────────────────────────────────────┘│
└──────────────────┬───────────────────────────────────────────────┘
                   │ HTTPS POST /api/chat
                   │ {query, history, context}
                   ↓
┌─────────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Railway/Render)                    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  main.py - FastAPI Application                             ││
│  │  ┌──────────────────────────────────────────────────────┐ ││
│  │  │  @app.post("/api/chat")                               │ ││
│  │  │  async def chat(request: ChatRequest):                │ ││
│  │  │    1. Validate input                                  │ ││
│  │  │    2. Create query embedding                          │ ││
│  │  │    3. Search Qdrant                                   │ ││
│  │  │    4. Build prompt                                    │ ││
│  │  │    5. Call GPT-3.5-turbo                              │ ││
│  │  │    6. Format response                                 │ ││
│  │  │    7. Return with citations                           │ ││
│  │  └──────────────────────────────────────────────────────┘ ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  rag.py - LangChain RAG Pipeline                           ││
│  │  ┌──────────────────────────────────────────────────────┐ ││
│  │  │  class RAGPipeline:                                   │ ││
│  │  │    - embeddings: OpenAIEmbeddings                     │ ││
│  │  │    - vectorstore: Qdrant                              │ ││
│  │  │    - llm: ChatOpenAI                                  │ ││
│  │  │    - retriever: QdrantRetriever                       │ ││
│  │  │    - chain: RetrievalQAChain                          │ ││
│  │  │                                                        │ ││
│  │  │  async def query(q, history, context):                │ ││
│  │  │    docs = await retriever.aget(q, k=5)               │ ││
│  │  │    prompt = build_prompt(q, docs, history)           │ ││
│  │  │    response = await llm.apredict(prompt)             │ ││
│  │  │    return format_response(response, docs)            │ ││
│  │  └──────────────────────────────────────────────────────┘ ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  index_content.py - Document Indexing                      ││
│  │  ┌──────────────────────────────────────────────────────┐ ││
│  │  │  def index_documents(docs_path):                      │ ││
│  │  │    1. Read all .md/.mdx files                         │ ││
│  │  │    2. Extract metadata (title, module, week)          │ ││
│  │  │    3. Split into chunks (~500 tokens)                 │ ││
│  │  │    4. Create embeddings                               │ ││
│  │  │    5. Upsert to Qdrant with metadata                  │ ││
│  │  │    6. Return indexing stats                           │ ││
│  │  └──────────────────────────────────────────────────────┘ ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  database.py - Qdrant Client Wrapper                       ││
│  │  ┌──────────────────────────────────────────────────────┐ ││
│  │  │  class QdrantDB:                                      │ ││
│  │  │    - client: QdrantClient                             │ ││
│  │  │    - collection: "textbook_docs"                      │ ││
│  │  │                                                        │ ││
│  │  │  async def search(embedding, k=5, filter=None):       │ ││
│  │  │    results = client.search(                           │ ││
│  │  │      collection_name="textbook_docs",                 │ ││
│  │  │      query_vector=embedding,                          │ ││
│  │  │      limit=k,                                         │ ││
│  │  │      query_filter=filter                              │ ││
│  │  │    )                                                  │ ││
│  │  │    return format_results(results)                     │ ││
│  │  └──────────────────────────────────────────────────────┘ ││
│  └────────────────────────────────────────────────────────────┘│
└──────┬────────────────────────────────┬────────────────────────┘
       │                                │
       │ OpenAI API Calls               │ Qdrant gRPC/HTTP
       ↓                                ↓
┌─────────────────────┐      ┌─────────────────────────┐
│    OpenAI API       │      │    Qdrant Cloud         │
│                     │      │                         │
│  ┌───────────────┐ │      │  ┌───────────────────┐ │
│  │ Embeddings    │ │      │  │ Collection:       │ │
│  │ ada-002       │ │      │  │ textbook_docs     │ │
│  │ $0.0001/1K    │ │      │  │                   │ │
│  └───────────────┘ │      │  │ Vectors: ~2000    │ │
│  ┌───────────────┐ │      │  │ Dims: 1536        │ │
│  │ Chat          │ │      │  │ Metric: cosine    │ │
│  │ gpt-3.5-turbo │ │      │  │                   │ │
│  │ $0.0015/1K    │ │      │  │ Metadata fields:  │ │
│  └───────────────┘ │      │  │ - title           │ │
│                     │      │  │ - url             │ │
│  Rate Limits:       │      │  │ - module          │ │
│  - 3500 req/min     │      │  │ - week            │ │
│  - 90K tokens/min   │      │  │ - content         │ │
│                     │      │  └───────────────────┘ │
└─────────────────────┘      └─────────────────────────┘
```

## Implementation Phases

### Phase 1: Backend Setup & RAG Pipeline (Week 1)
**Duration**: 12 hours
**Priority**: Critical

#### Task 1.1: Project Initialization
- [x] Create FastAPI project structure
- [x] Set up virtual environment
- [x] Install dependencies (FastAPI, LangChain, OpenAI, Qdrant)
- [x] Create `requirements.txt`
- [x] Set up environment variables (`.env` file)
- [x] Initialize Git repository

**Files Created**:
- `backend/main.py`
- `backend/requirements.txt`
- `backend/.env.example`
- `backend/README.md`

#### Task 1.2: Qdrant Setup
- [ ] Create Qdrant Cloud account
- [ ] Create collection "textbook_docs"
- [ ] Configure vector dimensions (1536)
- [ ] Set distance metric (cosine)
- [ ] Test connection from Python
- [ ] Create database wrapper (`database.py`)

**Configuration**:
```python
from qdrant_client import QdrantClient

client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

client.create_collection(
    collection_name="textbook_docs",
    vectors_config={
        "size": 1536,
        "distance": "Cosine"
    }
)
```

#### Task 1.3: Document Indexing Pipeline
- [ ] Create `index_content.py`
- [ ] Implement file reader (`.md`, `.mdx`)
- [ ] Build chunking logic (500 tokens, preserve code blocks)
- [ ] Extract metadata (title, module, week, URL)
- [ ] Create embeddings with OpenAI ada-002
- [ ] Upsert to Qdrant with metadata
- [ ] Add error handling and logging
- [ ] Test indexing on sample docs

**Chunking Strategy**:
- Max chunk size: 500 tokens (~400 words)
- Overlap: 50 tokens between chunks
- Preserve code blocks (don't split)
- Keep heading context in each chunk

#### Task 1.4: RAG Pipeline Implementation
- [ ] Create `rag.py`
- [ ] Initialize OpenAI embeddings
- [ ] Initialize ChatOpenAI (gpt-3.5-turbo)
- [ ] Create LangChain retriever
- [ ] Build prompt template
- [ ] Implement query function
- [ ] Add conversation history support
- [ ] Format responses with citations
- [ ] Test end-to-end RAG flow

**Prompt Template**:
```python
PROMPT = """You are a helpful AI tutor for a Physical AI and Robotics course.
Use the following context to answer the question. If you don't know the answer,
say so - don't make up information.

Context from textbook:
{context}

Conversation history:
{history}

Student question: {question}

Provide a clear, concise answer with code examples if relevant. Cite which sections
you used to answer.

Answer:"""
```

### Phase 2: API Endpoints (Week 1)
**Duration**: 8 hours
**Priority**: Critical

#### Task 2.1: Chat Endpoint
- [ ] Create `/api/chat` POST endpoint
- [ ] Define Pydantic models (ChatRequest, ChatResponse)
- [ ] Implement request validation
- [ ] Call RAG pipeline
- [ ] Format response JSON
- [ ] Add error handling
- [ ] Test with curl/Postman

**Request Model**:
```python
class ChatRequest(BaseModel):
    query: str
    history: List[Dict[str, str]] = []
    context: Optional[Dict[str, str]] = None
```

**Response Model**:
```python
class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]
    metadata: ResponseMetadata
```

#### Task 2.2: Index Endpoint
- [ ] Create `/api/index` POST endpoint
- [ ] Accept docs path parameter
- [ ] Call indexing function
- [ ] Return indexing stats
- [ ] Add authentication (API key)
- [ ] Test indexing workflow

#### Task 2.3: Health Check & CORS
- [ ] Create `/api/health` GET endpoint
- [ ] Check OpenAI API key validity
- [ ] Check Qdrant connection
- [ ] Configure CORS for frontend domain
- [ ] Add rate limiting middleware
- [ ] Test from frontend domain

### Phase 3: Frontend Chatbot Component (Week 2)
**Duration**: 10 hours
**Priority**: Critical

#### Task 3.1: Component Structure
- [ ] Create `src/components/Chatbot.tsx`
- [ ] Create `src/components/Chatbot.module.css`
- [ ] Define TypeScript interfaces
- [ ] Set up component state
- [ ] Implement open/close toggle
- [ ] Test basic rendering

**State Management**:
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
}

const [messages, setMessages] = useState<Message[]>([]);
const [isOpen, setIsOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [inputValue, setInputValue] = useState('');
```

#### Task 3.2: UI Layout
- [ ] Design widget container (400px × 600px)
- [ ] Create message list with scroll
- [ ] Build input field with send button
- [ ] Add toggle button (collapsed state)
- [ ] Style with CSS modules
- [ ] Implement responsive design (mobile fullscreen)
- [ ] Add loading spinner
- [ ] Test on different screen sizes

#### Task 3.3: API Integration
- [ ] Create API client (`apiClient.ts`)
- [ ] Implement POST to `/api/chat`
- [ ] Handle loading states
- [ ] Handle errors gracefully
- [ ] Add retry logic
- [ ] Show error messages to user
- [ ] Test with mock responses

**API Client**:
```typescript
async function sendMessage(
  query: string,
  history: Message[],
  context?: PageContext
): Promise<ChatResponse> {
  const response = await axios.post(
    `${API_BASE_URL}/api/chat`,
    { query, history, context }
  );
  return response.data;
}
```

#### Task 3.4: Text Selection Detection
- [ ] Add selection event listener
- [ ] Extract selected text from page
- [ ] Pre-fill input with "Explain: [text]"
- [ ] Show visual indicator for selection
- [ ] Handle selection clearing
- [ ] Test across different browsers

#### Task 3.5: Conversation History
- [ ] Save messages to localStorage
- [ ] Load history on component mount
- [ ] Implement clear history button
- [ ] Limit history to last 10 messages
- [ ] Format history for API
- [ ] Test persistence across page reloads

### Phase 4: Styling & UX Enhancements (Week 2)
**Duration**: 6 hours
**Priority**: Medium

#### Task 4.1: Markdown Rendering
- [ ] Install react-markdown
- [ ] Configure syntax highlighting (Prism)
- [ ] Style code blocks
- [ ] Add copy button to code blocks
- [ ] Handle inline code
- [ ] Test with sample responses

#### Task 4.2: Source Citations
- [ ] Create SourceCitation component
- [ ] Display source title + link
- [ ] Style citation cards
- [ ] Add click tracking (optional)
- [ ] Test citation links

#### Task 4.3: Animations & Transitions
- [ ] Add slide-in animation for widget
- [ ] Smooth scroll to new messages
- [ ] Typing indicator animation
- [ ] Button hover effects
- [ ] Loading spinner
- [ ] Test performance

#### Task 4.4: Accessibility
- [ ] Add ARIA labels
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Focus management
- [ ] Screen reader support
- [ ] Color contrast check
- [ ] Test with screen reader

### Phase 5: Deployment & Testing (Week 3)
**Duration**: 8 hours
**Priority**: High

#### Task 5.1: Backend Deployment
- [ ] Choose hosting (Railway or Render)
- [ ] Configure environment variables
- [ ] Set up Docker (optional)
- [ ] Deploy to production
- [ ] Test production API
- [ ] Set up monitoring

**Railway Deployment**:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy
railway up
```

#### Task 5.2: Index Production Data
- [ ] Run indexing script on full docs folder
- [ ] Verify all documents indexed
- [ ] Test retrieval quality
- [ ] Spot-check responses
- [ ] Monitor indexing time and costs

#### Task 5.3: Integration Testing
- [ ] Test chat flow end-to-end
- [ ] Test text selection feature
- [ ] Test conversation history
- [ ] Test error scenarios
- [ ] Test on mobile devices
- [ ] Test across browsers (Chrome, Firefox, Safari)

#### Task 5.4: Performance Optimization
- [ ] Measure response times
- [ ] Optimize chunk retrieval (tune k parameter)
- [ ] Add caching (optional)
- [ ] Minimize bundle size
- [ ] Test with concurrent users
- [ ] Monitor OpenAI costs

### Phase 6: Documentation & Launch (Week 3)
**Duration**: 4 hours
**Priority**: Medium

#### Task 6.1: Documentation
- [ ] Write backend README
- [ ] Document API endpoints
- [ ] Create setup guide for developers
- [ ] Add environment variable docs
- [ ] Write deployment guide
- [ ] Document indexing process

#### Task 6.2: User Guide
- [ ] Create user-facing help text
- [ ] Add example questions
- [ ] Document known limitations
- [ ] Add feedback mechanism
- [ ] Update textbook with chatbot info

#### Task 6.3: Monitoring Setup
- [ ] Set up error tracking (Sentry optional)
- [ ] Create health check dashboard
- [ ] Monitor OpenAI usage
- [ ] Track response quality
- [ ] Set up cost alerts

## Data Flow Details

### Chat Query Flow (Step-by-Step)

1. **User Types Question**
   - User: "What is inverse kinematics?"
   - Frontend captures input

2. **Frontend Preparation**
   - Load conversation history from localStorage
   - Detect current page context
   - Check for selected text
   - Build request payload

3. **API Request**
   ```json
   POST /api/chat
   {
     "query": "What is inverse kinematics?",
     "history": [...last 10 messages...],
     "context": {
       "page": "/docs/module-2/week-3",
       "selectedText": ""
     }
   }
   ```

4. **Backend Processing**
   - Validate request
   - Log query for monitoring
   - Extract query text

5. **Create Query Embedding**
   ```python
   query_embedding = openai_embeddings.embed_query(
       "What is inverse kinematics?"
   )
   # Returns: [0.123, -0.456, ...] (1536 dimensions)
   ```

6. **Vector Search in Qdrant**
   ```python
   results = qdrant_client.search(
       collection_name="textbook_docs",
       query_vector=query_embedding,
       limit=5,
       score_threshold=0.7
   )
   ```
   
   Returns top 5 chunks:
   - "Inverse kinematics (IK) is the process..." (score: 0.92)
   - "IK differs from forward kinematics..." (score: 0.88)
   - "Common IK algorithms include..." (score: 0.85)
   - "Applications of IK in robotics..." (score: 0.82)
   - "Mathematical formulation of IK..." (score: 0.79)

7. **Build Prompt**
   ```python
   prompt = PROMPT_TEMPLATE.format(
       context="\n\n".join([doc.content for doc in results]),
       history=format_history(request.history),
       question=request.query
   )
   ```

8. **LLM Generation**
   ```python
   response = await llm.agenerate([prompt])
   # GPT-3.5-turbo generates answer
   ```

9. **Format Response**
   ```json
   {
     "answer": "Inverse kinematics (IK) is the process of calculating the joint angles needed to position a robot's end effector at a desired location...",
     "sources": [
       {
         "title": "Robot Kinematics",
         "url": "/docs/module-2/week-3#inverse-kinematics",
         "snippet": "Inverse kinematics (IK) is..."
       }
     ],
     "metadata": {
       "tokens": 420,
       "duration": 2.1,
       "model": "gpt-3.5-turbo"
     }
   }
   ```

10. **Frontend Rendering**
    - Add message to state
    - Scroll to bottom
    - Render with react-markdown
    - Display source citations
    - Save to localStorage

### Indexing Flow (Step-by-Step)

1. **Trigger Indexing**
   ```bash
   curl -X POST http://localhost:8000/api/index \
     -H "Content-Type: application/json" \
     -d '{"path": "../docs", "force": false}'
   ```

2. **Read Files**
   ```python
   files = glob.glob("../docs/**/*.md", recursive=True)
   files += glob.glob("../docs/**/*.mdx", recursive=True)
   # Returns: ['../docs/module-1/intro.mdx', ...]
   ```

3. **Parse Each File**
   ```python
   for file in files:
       content = read_file(file)
       metadata = extract_metadata(file, content)
       # metadata = {
       #   "title": "Introduction to Physical AI",
       #   "url": "/docs/module-1/intro",
       #   "module": 1,
       #   "week": 1
       # }
   ```

4. **Chunk Content**
   ```python
   chunks = split_text(
       content,
       chunk_size=500,
       chunk_overlap=50,
       preserve_code=True
   )
   # Returns: ["Chunk 1...", "Chunk 2...", ...]
   ```

5. **Create Embeddings**
   ```python
   for chunk in chunks:
       embedding = openai_embeddings.embed_query(chunk)
       # embedding = [0.234, -0.567, ...] (1536 dims)
   ```

6. **Upsert to Qdrant**
   ```python
   qdrant_client.upsert(
       collection_name="textbook_docs",
       points=[
           {
               "id": generate_id(),
               "vector": embedding,
               "payload": {
                   "content": chunk,
                   "title": metadata["title"],
                   "url": metadata["url"],
                   "module": metadata["module"],
                   "week": metadata["week"]
               }
           }
       ]
   )
   ```

7. **Return Stats**
   ```json
   {
     "status": "success",
     "indexed": 87,
     "duration": 45.2,
     "timestamp": "2025-12-23T10:30:00Z"
   }
   ```

## API Endpoint Specifications

### POST /api/chat

**Request**:
```json
{
  "query": "string",           // Required: User's question
  "history": [                 // Optional: Conversation history
    {
      "role": "user|assistant",
      "content": "string"
    }
  ],
  "context": {                 // Optional: Page context
    "page": "string",          // Current page URL
    "selectedText": "string"   // Highlighted text
  }
}
```

**Response (200 OK)**:
```json
{
  "answer": "string",
  "sources": [
    {
      "title": "string",
      "url": "string",
      "snippet": "string"
    }
  ],
  "metadata": {
    "tokens": 0,
    "duration": 0.0,
    "model": "string"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: OpenAI or Qdrant down

### POST /api/index

**Request**:
```json
{
  "path": "string",    // Path to docs folder
  "force": false       // Re-index even if already indexed
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "indexed": 0,
  "duration": 0.0,
  "timestamp": "string"
}
```

### GET /api/health

**Response (200 OK)**:
```json
{
  "status": "healthy",
  "services": {
    "openai": "connected",
    "qdrant": "connected"
  },
  "timestamp": "string"
}
```

## Performance Targets

### Response Time
- **Embedding**: < 200ms
- **Vector Search**: < 100ms
- **LLM Generation**: < 2000ms
- **Total Response**: < 3000ms (p95)

### Cost per Query
- **Embedding**: $0.0001 (100 tokens)
- **LLM**: $0.0015 (1000 tokens)
- **Total**: ~$0.002 per query
- **Monthly (1000 queries)**: ~$2

### Throughput
- **Concurrent Users**: 10
- **Queries per Second**: 5
- **Daily Queries**: 500-1000

### Indexing
- **Documents**: ~2000 chunks
- **Indexing Time**: < 10 minutes
- **Storage**: < 1GB
- **Update Frequency**: Weekly or on-demand

## Security Considerations

### API Key Management
- Store in environment variables
- Never commit to Git
- Use `.env.example` for documentation
- Rotate keys periodically

### Rate Limiting
- 10 requests per minute per IP
- Token usage limits (4000 tokens/request)
- Ban abusive IPs

### Input Validation
- Sanitize user input
- Limit query length (500 chars)
- Prevent prompt injection
- Validate message history length

### Error Handling
- Don't leak sensitive info in errors
- Log errors securely
- Return generic error messages to users
- Monitor error rates

## Testing Strategy

### Unit Tests
- Test chunking logic
- Test embedding creation
- Test prompt building
- Test response formatting

### Integration Tests
- Test end-to-end RAG flow
- Test API endpoints
- Test error handling
- Test rate limiting

### Manual Testing
- Test with real questions
- Test edge cases
- Test on mobile
- Test across browsers

### Performance Testing
- Load testing (Artillery or k6)
- Measure response times
- Test concurrent users
- Monitor costs during testing

## Monitoring & Observability

### Metrics to Track
- **Usage**: Queries per day, unique users
- **Performance**: Response time, latency breakdown
- **Quality**: Retrieval relevance, answer quality
- **Cost**: OpenAI spend, tokens per query
- **Errors**: Error rate, timeout rate
- **Availability**: Uptime, health check status

### Logging
- Log all queries (without PII)
- Log errors with stack traces
- Log performance metrics
- Log cost per query

### Alerts
- High error rate (> 5%)
- Slow responses (> 5s)
- High costs (> $1/day)
- Service downtime

## Rollout Plan

### Week 1
- Deploy backend to staging
- Test with sample queries
- Index full textbook
- Verify retrieval quality

### Week 2
- Deploy frontend to staging
- Internal testing with team
- Fix bugs and edge cases
- Optimize performance

### Week 3
- Deploy to production
- Soft launch to 10 students
- Monitor usage and errors
- Gather feedback

### Week 4
- Full launch to all students
- Announce in course materials
- Monitor costs and performance
- Iterate based on feedback

## Success Criteria

### Technical
✅ Response time < 3 seconds (p95)
✅ 99% uptime
✅ < 1% error rate
✅ Accurate retrieval (top 5 includes answer)
✅ No hallucinations detected

### Business
✅ 50+ queries per day
✅ 90% positive feedback
✅ Cost < $10/month
✅ Reduces teacher support load
✅ Students report satisfaction

### User Experience
✅ Intuitive UI, no training needed
✅ Works on mobile and desktop
✅ Fast enough to feel responsive
✅ Answers are helpful and accurate
✅ Sources are relevant and linked correctly
