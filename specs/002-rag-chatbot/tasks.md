# Task Breakdown: RAG Chatbot

## Overview
Complete task list for building and deploying the RAG-powered chatbot with FastAPI backend, LangChain orchestration, and React frontend.

**Total Estimated Duration**: 48 hours
**Timeline**: 3 weeks
**Team Size**: 1-2 developers

---

## Phase 1: Backend Foundation (Week 1, Days 1-2)

### Task 1.1: Project Setup ✅
**Status**: Complete
**Duration**: 1 hour
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Create `backend/` directory
- [x] Initialize Python virtual environment
- [x] Create `requirements.txt` with dependencies
- [x] Create `.env.example` file
- [x] Initialize Git repository
- [x] Create basic project structure

**Commands**:
```bash
mkdir backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
touch requirements.txt .env.example
```

**Files Created**:
- `backend/requirements.txt`
- `backend/.env.example`
- `backend/README.md`

**Dependencies**:
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
langchain==0.1.0
openai==1.6.1
qdrant-client==1.7.0
python-dotenv==1.0.0
pydantic==2.5.0
```

**Validation**:
- [x] Virtual environment activates successfully
- [x] All dependencies install without errors
- [x] `.env.example` contains all required variables

---

### Task 1.2: Environment Configuration ✅
**Status**: Complete
**Duration**: 30 minutes
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Sign up for OpenAI API
- [x] Get OpenAI API key
- [x] Sign up for Qdrant Cloud (free tier)
- [x] Create Qdrant cluster
- [x] Get Qdrant URL and API key
- [x] Create `.env` file (copy from `.env.example`)
- [x] Add keys to `.env`
- [x] Test API connections

**Environment Variables**:
```bash
OPENAI_API_KEY=sk-...
QDRANT_URL=https://...qdrant.tech
QDRANT_API_KEY=...
DOCS_PATH=../docs
PORT=8000
```

**Validation**:
- [x] OpenAI API key works (test with simple call)
- [x] Qdrant cluster is accessible
- [x] `.env` file in `.gitignore`

---

### Task 1.3: Qdrant Database Setup
**Status**: In Progress
**Duration**: 2 hours
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [ ] Create `database.py`
- [ ] Initialize Qdrant client
- [ ] Create collection "textbook_docs"
- [ ] Configure vector parameters (1536 dims, cosine)
- [ ] Implement connection testing
- [ ] Add error handling for connection failures
- [ ] Implement search wrapper function
- [ ] Test basic insert and search

**Files Created**:
- `backend/database.py`

**Code Structure**:
```python
class QdrantDB:
    def __init__(self):
        self.client = QdrantClient(...)
        self.collection_name = "textbook_docs"
    
    def create_collection(self):
        # Create collection with vector config
    
    async def search(self, embedding, k=5, filter=None):
        # Search for similar vectors
    
    async def upsert(self, points):
        # Insert or update vectors
    
    def health_check(self):
        # Verify connection
```

**Validation**:
- [ ] Collection created successfully
- [ ] Can insert test vector
- [ ] Can search and retrieve results
- [ ] Connection errors handled gracefully

---

### Task 1.4: Document Indexing Pipeline
**Status**: Not Started
**Duration**: 4 hours
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [ ] Create `index_content.py`
- [ ] Implement file discovery (glob for .md, .mdx)
- [ ] Implement metadata extraction (title, module, week, URL)
- [ ] Implement text chunking (500 tokens, 50 overlap)
- [ ] Handle code block preservation (don't split)
- [ ] Create embeddings via OpenAI ada-002
- [ ] Batch processing for efficiency
- [ ] Upsert to Qdrant with metadata
- [ ] Add progress logging
- [ ] Handle errors and retries
- [ ] Test on sample documents

**Files Created**:
- `backend/index_content.py`

**Key Functions**:
```python
def read_markdown_files(docs_path: str) -> List[Document]:
    # Read all .md and .mdx files

def extract_metadata(filepath: str, content: str) -> dict:
    # Extract title, module, week from file path and content

def chunk_document(content: str, chunk_size=500, overlap=50) -> List[str]:
    # Split into chunks, preserve code blocks

async def create_embeddings(texts: List[str]) -> List[List[float]]:
    # Create embeddings via OpenAI

async def index_documents(docs_path: str) -> dict:
    # Main indexing function
```

**Validation**:
- [ ] All files in `docs/` discovered
- [ ] Metadata extracted correctly
- [ ] Chunks are ~500 tokens
- [ ] Code blocks not split across chunks
- [ ] Embeddings created successfully
- [ ] All chunks inserted to Qdrant
- [ ] Can query indexed content

---

### Task 1.5: RAG Pipeline Implementation
**Status**: Not Started
**Duration**: 5 hours
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [ ] Create `rag.py`
- [ ] Initialize OpenAI embeddings
- [ ] Initialize ChatOpenAI (gpt-3.5-turbo)
- [ ] Set up LangChain retriever with Qdrant
- [ ] Create prompt template
- [ ] Implement query embedding
- [ ] Implement retrieval (top 5 chunks)
- [ ] Implement context formatting
- [ ] Add conversation history support
- [ ] Implement LLM generation
- [ ] Format response with citations
- [ ] Add error handling
- [ ] Test with sample queries

**Files Created**:
- `backend/rag.py`

**Prompt Template**:
```python
SYSTEM_PROMPT = """You are a helpful AI tutor for a Physical AI and Robotics course.
Your role is to answer student questions using ONLY the provided textbook context.

Rules:
1. Base answers ONLY on the given context
2. If the context doesn't contain the answer, say "I don't have information about that in the course materials"
3. Provide clear, concise explanations
4. Use code examples when relevant
5. Cite which sections you used
6. Maintain a friendly, educational tone

Context from textbook:
{context}

Previous conversation:
{history}

Student question: {question}

Provide a helpful answer with citations:"""
```

**Code Structure**:
```python
class RAGPipeline:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()
        self.llm = ChatOpenAI(model="gpt-3.5-turbo")
        self.db = QdrantDB()
    
    async def query(self, question: str, history: List, context: dict) -> dict:
        # Main query function
        
    async def retrieve_context(self, question: str, k=5) -> List[Document]:
        # Retrieve relevant chunks
        
    def build_prompt(self, question: str, context: List, history: List) -> str:
        # Build final prompt
        
    def format_response(self, answer: str, sources: List) -> dict:
        # Format final response with citations
```

**Validation**:
- [ ] Query returns relevant chunks
- [ ] LLM generates coherent answers
- [ ] Citations included correctly
- [ ] Conversation history incorporated
- [ ] Handles errors gracefully
- [ ] Response time < 3 seconds

---

## Phase 2: API Development (Week 1, Days 3-4)

### Task 2.1: FastAPI Application Setup
**Status**: In Progress
**Duration**: 2 hours
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [x] Create `main.py`
- [x] Initialize FastAPI app
- [ ] Configure CORS middleware
- [ ] Add request validation middleware
- [ ] Add logging middleware
- [ ] Add rate limiting middleware
- [ ] Create Pydantic models
- [ ] Set up startup/shutdown events
- [ ] Test basic endpoint

**Files Modified**:
- `backend/main.py`

**Code Structure**:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RAG Chatbot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.vercel.app"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # Initialize RAG pipeline

@app.on_event("shutdown")
async def shutdown():
    # Cleanup
```

**Validation**:
- [x] App starts successfully
- [ ] CORS configured correctly
- [ ] Middleware working
- [ ] OpenAPI docs accessible at /docs

---

### Task 2.2: Chat Endpoint Implementation
**Status**: Not Started
**Duration**: 3 hours
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [ ] Create `/api/chat` POST endpoint
- [ ] Define `ChatRequest` Pydantic model
- [ ] Define `ChatResponse` Pydantic model
- [ ] Implement request validation
- [ ] Call RAG pipeline
- [ ] Handle exceptions
- [ ] Format response
- [ ] Add response time tracking
- [ ] Add token usage tracking
- [ ] Test with curl/Postman

**Files Modified**:
- `backend/main.py`

**Pydantic Models**:
```python
class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class PageContext(BaseModel):
    page: Optional[str] = None
    selectedText: Optional[str] = None

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    history: List[Message] = Field(default_factory=list, max_length=10)
    context: Optional[PageContext] = None

class Source(BaseModel):
    title: str
    url: str
    snippet: str

class ResponseMetadata(BaseModel):
    tokens: int
    duration: float
    model: str

class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]
    metadata: ResponseMetadata
```

**Endpoint Implementation**:
```python
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        start_time = time.time()
        
        # Query RAG pipeline
        result = await rag_pipeline.query(
            question=request.query,
            history=request.history,
            context=request.context
        )
        
        duration = time.time() - start_time
        
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"],
            metadata=ResponseMetadata(
                tokens=result["tokens"],
                duration=duration,
                model="gpt-3.5-turbo"
            )
        )
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Error processing query")
```

**Validation**:
- [ ] Endpoint accepts valid requests
- [ ] Returns properly formatted responses
- [ ] Validates input correctly
- [ ] Handles errors gracefully
- [ ] Response time logged
- [ ] Token usage tracked

---

### Task 2.3: Index Endpoint Implementation
**Status**: Not Started
**Duration**: 1.5 hours
**Priority**: High
**Assignee**: Backend Developer

**Steps**:
- [ ] Create `/api/index` POST endpoint
- [ ] Add API key authentication
- [ ] Define `IndexRequest` model
- [ ] Define `IndexResponse` model
- [ ] Call indexing function
- [ ] Return stats
- [ ] Add error handling
- [ ] Test indexing workflow

**Files Modified**:
- `backend/main.py`

**Models**:
```python
class IndexRequest(BaseModel):
    path: str = Field(default="../docs")
    force: bool = Field(default=False)

class IndexResponse(BaseModel):
    status: str
    indexed: int
    duration: float
    timestamp: str
```

**Implementation**:
```python
@app.post("/api/index", response_model=IndexResponse)
async def index(request: IndexRequest, api_key: str = Header(None)):
    # Verify API key
    if api_key != os.getenv("ADMIN_API_KEY"):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Run indexing
    start_time = time.time()
    result = await index_documents(request.path, request.force)
    duration = time.time() - start_time
    
    return IndexResponse(
        status="success",
        indexed=result["count"],
        duration=duration,
        timestamp=datetime.now().isoformat()
    )
```

**Validation**:
- [ ] Requires valid API key
- [ ] Indexes documents correctly
- [ ] Returns accurate stats
- [ ] Handles errors

---

### Task 2.4: Health Check Endpoint
**Status**: Not Started
**Duration**: 1 hour
**Priority**: Medium
**Assignee**: Backend Developer

**Steps**:
- [ ] Create `/api/health` GET endpoint
- [ ] Check OpenAI connection
- [ ] Check Qdrant connection
- [ ] Return status for each service
- [ ] Add timestamp
- [ ] Test endpoint

**Implementation**:
```python
@app.get("/api/health")
async def health():
    openai_status = "connected" if check_openai() else "disconnected"
    qdrant_status = "connected" if db.health_check() else "disconnected"
    
    return {
        "status": "healthy" if all([openai_status == "connected", qdrant_status == "connected"]) else "degraded",
        "services": {
            "openai": openai_status,
            "qdrant": qdrant_status
        },
        "timestamp": datetime.now().isoformat()
    }
```

**Validation**:
- [ ] Returns correct status
- [ ] Detects service failures
- [ ] Responds quickly (< 500ms)

---

### Task 2.5: Rate Limiting & Security
**Status**: Not Started
**Duration**: 2 hours
**Priority**: High
**Assignee**: Backend Developer

**Steps**:
- [ ] Install slowapi or similar
- [ ] Add rate limiting middleware
- [ ] Configure limits (10 req/min per IP)
- [ ] Add request logging
- [ ] Implement input sanitization
- [ ] Add error handling
- [ ] Test rate limiting

**Implementation**:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/chat")
@limiter.limit("10/minute")
async def chat(...):
    ...
```

**Validation**:
- [ ] Rate limit enforced
- [ ] Returns 429 when exceeded
- [ ] Logs suspicious activity
- [ ] Input validation works

---

## Phase 3: Frontend Development (Week 2, Days 1-3)

### Task 3.1: Component Structure Setup
**Status**: In Progress
**Duration**: 2 hours
**Priority**: Critical
**Assignee**: Frontend Developer

**Steps**:
- [x] Create `src/components/Chatbot.tsx`
- [x] Create `src/components/Chatbot.module.css`
- [ ] Define TypeScript interfaces
- [ ] Set up component state
- [ ] Implement basic render
- [ ] Add to site layout
- [ ] Test component mounts

**Files Created**:
- `src/components/Chatbot.tsx`
- `src/components/Chatbot.module.css`

**TypeScript Interfaces**:
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
}

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface ChatbotState {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  inputValue: string;
  error: string | null;
}

interface PageContext {
  page: string;
  selectedText: string;
}
```

**State Setup**:
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [isOpen, setIsOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [inputValue, setInputValue] = useState('');
const [error, setError] = useState<string | null>(null);
```

**Validation**:
- [x] Component renders without errors
- [ ] State management working
- [ ] TypeScript types correct
- [ ] No console warnings

---

### Task 3.2: UI Layout Implementation
**Status**: Not Started
**Duration**: 4 hours
**Priority**: Critical
**Assignee**: Frontend Developer

**Steps**:
- [ ] Design widget container
- [ ] Implement toggle button (collapsed state)
- [ ] Create message list with scroll
- [ ] Build input field
- [ ] Add send button
- [ ] Add clear history button
- [ ] Implement loading spinner
- [ ] Style with CSS modules
- [ ] Make responsive (mobile fullscreen)
- [ ] Test on different screen sizes

**CSS Structure** (`Chatbot.module.css`):
```css
.container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.widget {
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.toggleButton {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #2e8555;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.messageList {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.inputContainer {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 768px) {
  .widget {
    width: 100vw;
    height: 100vh;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }
}
```

**Validation**:
- [ ] Widget opens/closes smoothly
- [ ] Layout looks good on desktop
- [ ] Layout looks good on mobile
- [ ] Scroll works correctly
- [ ] Buttons are clickable

---

### Task 3.3: API Client Implementation
**Status**: Not Started
**Duration**: 2 hours
**Priority**: Critical
**Assignee**: Frontend Developer

**Steps**:
- [ ] Create `src/lib/apiClient.ts`
- [ ] Install axios
- [ ] Implement POST to `/api/chat`
- [ ] Add error handling
- [ ] Add retry logic
- [ ] Add request timeout
- [ ] Test with mock data

**Files Created**:
- `src/lib/apiClient.ts`

**API Client**:
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ChatRequest {
  query: string;
  history: Message[];
  context?: PageContext;
}

interface ChatResponse {
  answer: string;
  sources: Source[];
  metadata: {
    tokens: number;
    duration: number;
    model: string;
  };
}

export async function sendMessage(
  query: string,
  history: Message[],
  context?: PageContext
): Promise<ChatResponse> {
  try {
    const response = await client.post<ChatResponse>('/api/chat', {
      query,
      history: history.slice(-10), // Last 10 messages
      context,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to get response');
    }
    throw error;
  }
}

export async function healthCheck(): Promise<any> {
  const response = await client.get('/api/health');
  return response.data;
}
```

**Validation**:
- [ ] API calls succeed
- [ ] Errors handled gracefully
- [ ] Timeout works
- [ ] Response parsed correctly

---

### Task 3.4: Message Sending Logic
**Status**: Not Started
**Duration**: 2 hours
**Priority**: Critical
**Assignee**: Frontend Developer

**Steps**:
- [ ] Implement `handleSend` function
- [ ] Add optimistic UI update
- [ ] Call API client
- [ ] Handle loading state
- [ ] Handle errors
- [ ] Update message list
- [ ] Clear input field
- [ ] Scroll to bottom
- [ ] Test message flow

**Implementation**:
```typescript
const handleSend = async () => {
  if (!inputValue.trim() || isLoading) return;

  const userMessage: Message = {
    id: uuidv4(),
    role: 'user',
    content: inputValue,
    timestamp: new Date(),
  };

  // Optimistic update
  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsLoading(true);
  setError(null);

  try {
    const context: PageContext = {
      page: window.location.pathname,
      selectedText: getSelectedText(),
    };

    const response = await sendMessage(
      inputValue,
      messages,
      context
    );

    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: response.answer,
      sources: response.sources,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    scrollToBottom();
  } catch (error) {
    setError(error.message);
    // Remove optimistic user message on error
    setMessages(prev => prev.slice(0, -1));
  } finally {
    setIsLoading(false);
  }
};
```

**Validation**:
- [ ] Messages sent successfully
- [ ] Loading state shown
- [ ] Errors displayed
- [ ] UI updates correctly
- [ ] Scroll works

---

### Task 3.5: Text Selection Detection
**Status**: Not Started
**Duration**: 2 hours
**Priority**: Medium
**Assignee**: Frontend Developer

**Steps**:
- [ ] Add selection event listener
- [ ] Extract selected text
- [ ] Store in state
- [ ] Pre-fill input with "Explain: [text]"
- [ ] Add visual indicator
- [ ] Handle selection clearing
- [ ] Test across browsers

**Implementation**:
```typescript
useEffect(() => {
  const handleSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 10 && text.length < 200) {
      setInputValue(`Explain: "${text}"`);
      setIsOpen(true); // Auto-open chatbot
    }
  };

  document.addEventListener('mouseup', handleSelection);
  return () => document.removeEventListener('mouseup', handleSelection);
}, []);

const getSelectedText = (): string => {
  return window.getSelection()?.toString().trim() || '';
};
```

**Validation**:
- [ ] Selection detected correctly
- [ ] Input pre-filled
- [ ] Works on Chrome, Firefox, Safari
- [ ] Doesn't interfere with normal selection

---

### Task 3.6: Conversation History Persistence
**Status**: Not Started
**Duration**: 1.5 hours
**Priority**: Medium
**Assignee**: Frontend Developer

**Steps**:
- [ ] Save messages to localStorage
- [ ] Load history on mount
- [ ] Implement clear history function
- [ ] Limit to last 10 messages
- [ ] Handle localStorage errors
- [ ] Test persistence across reloads

**Implementation**:
```typescript
const STORAGE_KEY = 'chatbot_history';

// Load history on mount
useEffect(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed.slice(-10)); // Last 10 messages
    }
  } catch (error) {
    console.error('Failed to load history:', error);
  }
}, []);

// Save history on change
useEffect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}, [messages]);

const handleClearHistory = () => {
  setMessages([]);
  localStorage.removeItem(STORAGE_KEY);
};
```

**Validation**:
- [ ] History persists across reloads
- [ ] Clear button works
- [ ] Handles quota exceeded error
- [ ] Limited to 10 messages

---

## Phase 4: Styling & Polish (Week 2, Days 4-5)

### Task 4.1: Markdown Rendering
**Status**: Not Started
**Duration**: 2 hours
**Priority**: High
**Assignee**: Frontend Developer

**Steps**:
- [ ] Install react-markdown
- [ ] Install react-syntax-highlighter
- [ ] Configure markdown renderer
- [ ] Style code blocks
- [ ] Add copy button to code blocks
- [ ] Handle inline code
- [ ] Test with sample responses

**Installation**:
```bash
npm install react-markdown react-syntax-highlighter
npm install @types/react-syntax-highlighter
```

**Implementation**:
```typescript
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MessageContent = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className={styles.codeBlock}>
              <button onClick={() => copyCode(children)}>Copy</button>
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className={styles.inlineCode} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
```

**Validation**:
- [ ] Code blocks highlighted correctly
- [ ] Copy button works
- [ ] Inline code styled
- [ ] Markdown renders properly

---

### Task 4.2: Source Citations Component
**Status**: Not Started
**Duration**: 1.5 hours
**Priority**: Medium
**Assignee**: Frontend Developer

**Steps**:
- [ ] Create `SourceCitation.tsx` component
- [ ] Design citation card
- [ ] Add click to navigate
- [ ] Style with CSS modules
- [ ] Add hover effects
- [ ] Test navigation

**Files Created**:
- `src/components/SourceCitation.tsx`
- `src/components/SourceCitation.module.css`

**Component**:
```typescript
interface SourceCitationProps {
  sources: Source[];
}

const SourceCitation: React.FC<SourceCitationProps> = ({ sources }) => {
  return (
    <div className={styles.citationContainer}>
      <p className={styles.citationLabel}>Sources:</p>
      {sources.map((source, index) => (
        <a
          key={index}
          href={source.url}
          className={styles.citationCard}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.citationTitle}>{source.title}</div>
          <div className={styles.citationSnippet}>{source.snippet}</div>
        </a>
      ))}
    </div>
  );
};
```

**Styling**:
```css
.citationCard {
  display: block;
  padding: 12px;
  margin-top: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s;
}

.citationCard:hover {
  background: #e0e0e0;
}

.citationTitle {
  font-weight: 600;
  margin-bottom: 4px;
  color: #2e8555;
}

.citationSnippet {
  font-size: 0.9em;
  color: #666;
}
```

**Validation**:
- [ ] Citations display correctly
- [ ] Links work
- [ ] Hover effects smooth
- [ ] Responsive on mobile

---

### Task 4.3: Animations & Transitions
**Status**: Not Started
**Duration**: 2 hours
**Priority**: Low
**Assignee**: Frontend Developer

**Steps**:
- [ ] Add slide-in animation for widget
- [ ] Add fade-in for messages
- [ ] Smooth scroll to new messages
- [ ] Typing indicator animation
- [ ] Button hover effects
- [ ] Loading spinner
- [ ] Test performance

**Animations**:
```css
@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.widget {
  animation: slideIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.message {
  animation: fadeIn 0.3s ease-out;
}

.typingIndicator {
  display: flex;
  gap: 4px;
}

.typingIndicator span {
  width: 8px;
  height: 8px;
  background: #2e8555;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typingIndicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typingIndicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
```

**Validation**:
- [ ] Animations smooth (60fps)
- [ ] No performance issues
- [ ] Looks good on mobile
- [ ] Accessible (respects prefers-reduced-motion)

---

### Task 4.4: Accessibility Implementation
**Status**: Not Started
**Duration**: 2 hours
**Priority**: High
**Assignee**: Frontend Developer

**Steps**:
- [ ] Add ARIA labels
- [ ] Implement keyboard navigation
- [ ] Add focus management
- [ ] Test with screen reader
- [ ] Check color contrast
- [ ] Add skip links
- [ ] Test keyboard-only usage

**Implementation**:
```typescript
<div
  className={styles.widget}
  role="dialog"
  aria-label="Chat assistant"
  aria-describedby="chatbot-description"
>
  <div id="chatbot-description" className="sr-only">
    AI-powered chatbot for course questions
  </div>
  
  <button
    aria-label="Close chatbot"
    onClick={() => setIsOpen(false)}
  >
    ×
  </button>
  
  <div
    className={styles.messageList}
    role="log"
    aria-live="polite"
    aria-atomic="false"
  >
    {messages.map(msg => (
      <div
        key={msg.id}
        role="article"
        aria-label={`${msg.role} message`}
      >
        {msg.content}
      </div>
    ))}
  </div>
  
  <form onSubmit={handleSend}>
    <input
      type="text"
      aria-label="Chat message"
      placeholder="Ask a question..."
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      }}
    />
    <button type="submit" aria-label="Send message">
      Send
    </button>
  </form>
</div>
```

**Validation**:
- [ ] All interactive elements have labels
- [ ] Tab order logical
- [ ] Screen reader announces messages
- [ ] Keyboard shortcuts work
- [ ] Contrast ratios meet WCAG AA
- [ ] Focus visible

---

## Phase 5: Testing & Deployment (Week 3)

### Task 5.1: Backend Deployment
**Status**: Not Started
**Duration**: 3 hours
**Priority**: Critical
**Assignee**: DevOps / Backend Developer

**Steps**:
- [ ] Choose hosting platform (Railway or Render)
- [ ] Create account and project
- [ ] Configure environment variables
- [ ] Set up build command
- [ ] Deploy backend
- [ ] Test production API
- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificate

**Railway Deployment**:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to project
railway link

# Add environment variables
railway variables set OPENAI_API_KEY=...
railway variables set QDRANT_URL=...
railway variables set QDRANT_API_KEY=...

# Deploy
railway up

# Get URL
railway domain
```

**Render Deployment**:
- Create new Web Service
- Connect GitHub repo
- Set build command: `pip install -r requirements.txt`
- Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add environment variables
- Deploy

**Validation**:
- [ ] Backend accessible via public URL
- [ ] Health check endpoint returns 200
- [ ] CORS works from frontend domain
- [ ] Environment variables loaded
- [ ] SSL certificate active

---

### Task 5.2: Index Production Documents
**Status**: Not Started
**Duration**: 1 hour
**Priority**: Critical
**Assignee**: Backend Developer

**Steps**:
- [ ] Run indexing script locally or via API
- [ ] Point to production docs folder
- [ ] Monitor indexing progress
- [ ] Verify all documents indexed
- [ ] Test retrieval quality
- [ ] Check Qdrant dashboard

**Command**:
```bash
# Via API
curl -X POST https://your-backend.railway.app/api/index \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_ADMIN_KEY" \
  -d '{"path": "../docs", "force": true}'

# Or run script directly
python backend/index_content.py
```

**Validation**:
- [ ] All ~2000 chunks indexed
- [ ] Metadata correct
- [ ] Search returns relevant results
- [ ] No errors in logs

---

### Task 5.3: Frontend Environment Configuration
**Status**: Not Started
**Duration**: 1 hour
**Priority**: Critical
**Assignee**: Frontend Developer

**Steps**:
- [ ] Create `.env.production` file
- [ ] Add backend API URL
- [ ] Update Vercel environment variables
- [ ] Test API calls from production
- [ ] Verify CORS

**Environment Variables**:
```bash
REACT_APP_API_URL=https://your-backend.railway.app
```

**Vercel Setup**:
- Go to Project Settings > Environment Variables
- Add `REACT_APP_API_URL`
- Redeploy

**Validation**:
- [ ] API URL correct in production
- [ ] Chatbot connects to backend
- [ ] No CORS errors

---

### Task 5.4: Integration Testing
**Status**: Not Started
**Duration**: 4 hours
**Priority**: Critical
**Assignee**: QA / Full Stack Developer

**Test Cases**:
- [ ] **Basic Chat Flow**
  - Open chatbot
  - Send question
  - Receive answer with sources
  - Click source link (navigates correctly)
  
- [ ] **Text Selection**
  - Highlight text on page
  - Chatbot opens with pre-filled input
  - Send selection query
  - Receive relevant answer
  
- [ ] **Conversation History**
  - Send multiple messages
  - Verify follow-up questions work
  - Reload page
  - Verify history persists
  - Clear history
  
- [ ] **Error Handling**
  - Test with backend down
  - Test with invalid API key
  - Test with network timeout
  - Test with rate limit exceeded
  - Verify error messages shown
  
- [ ] **Mobile Experience**
  - Open on mobile device
  - Widget goes fullscreen
  - Keyboard doesn't obscure input
  - Touch interactions work
  
- [ ] **Performance**
  - Test response time (< 3 seconds)
  - Test with 10 concurrent users
  - Monitor backend CPU/memory
  - Check OpenAI costs

**Tools**:
- Manual testing
- Browser DevTools
- Lighthouse
- BrowserStack (mobile testing)

**Validation**:
- [ ] All test cases pass
- [ ] No critical bugs found
- [ ] Performance within targets
- [ ] Mobile experience good

---

### Task 5.5: Load Testing
**Status**: Not Started
**Duration**: 2 hours
**Priority**: Medium
**Assignee**: DevOps

**Steps**:
- [ ] Install k6 or Artillery
- [ ] Write load test script
- [ ] Simulate 10 concurrent users
- [ ] Simulate 100 requests over 5 minutes
- [ ] Monitor backend performance
- [ ] Monitor OpenAI rate limits
- [ ] Analyze results

**k6 Script**:
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 10 },  // Ramp up to 10 users
    { duration: '3m', target: 10 },  // Stay at 10 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
};

export default function () {
  const payload = JSON.stringify({
    query: 'What is Physical AI?',
    history: [],
    context: null,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('https://your-backend.railway.app/api/chat', payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 3s': (r) => r.timings.duration < 3000,
  });

  sleep(5); // 5 second pause between requests
}
```

**Validation**:
- [ ] No errors under load
- [ ] Response time < 3s (p95)
- [ ] Backend stable
- [ ] No rate limit errors

---

### Task 5.6: Documentation
**Status**: Not Started
**Duration**: 3 hours
**Priority**: Medium
**Assignee**: Technical Writer / Developer

**Steps**:
- [ ] Write backend README
- [ ] Document API endpoints
- [ ] Write setup guide
- [ ] Document environment variables
- [ ] Write deployment guide
- [ ] Add user guide to textbook
- [ ] Create troubleshooting guide
- [ ] Add examples

**Documentation Structure**:
```
backend/README.md
  - Setup Instructions
  - Environment Variables
  - Running Locally
  - API Documentation
  - Deployment Guide
  - Indexing Process
  
docs/chatbot-guide.md
  - How to Use the Chatbot
  - Example Questions
  - Known Limitations
  - Feedback & Support
```

**Validation**:
- [ ] All docs complete
- [ ] Examples work
- [ ] Setup guide tested by new developer

---

### Task 5.7: Monitoring Setup
**Status**: Not Started
**Duration**: 2 hours
**Priority**: Medium
**Assignee**: DevOps

**Steps**:
- [ ] Set up health check monitoring (UptimeRobot)
- [ ] Configure OpenAI usage alerts
- [ ] Set up error logging (optional: Sentry)
- [ ] Create cost tracking spreadsheet
- [ ] Set up weekly usage reports
- [ ] Configure alerts

**Monitoring**:
- **Uptime**: UptimeRobot (free) - ping /api/health every 5 minutes
- **Errors**: Log to file, review weekly
- **Costs**: OpenAI dashboard, track daily spend
- **Usage**: Log queries per day

**Alerts**:
- Backend down for > 5 minutes
- OpenAI spend > $1/day
- Error rate > 5%

**Validation**:
- [ ] Health checks working
- [ ] Alerts configured
- [ ] Can view usage stats

---

## Phase 6: Launch & Iteration (Week 3, Final Days)

### Task 6.1: Soft Launch
**Status**: Not Started
**Duration**: 1 day
**Priority**: High
**Assignee**: Product Manager / Developer

**Steps**:
- [ ] Deploy to production
- [ ] Test with 5-10 beta users
- [ ] Gather feedback
- [ ] Monitor errors and performance
- [ ] Fix critical issues
- [ ] Adjust retrieval parameters if needed

**Validation**:
- [ ] Beta users can use chatbot
- [ ] Feedback collected
- [ ] Major issues resolved

---

### Task 6.2: Full Launch
**Status**: Not Started
**Duration**: 1 day
**Priority**: High
**Assignee**: Product Manager

**Steps**:
- [ ] Announce in course materials
- [ ] Add chatbot info to intro page
- [ ] Send email to all students
- [ ] Monitor usage and costs
- [ ] Respond to feedback
- [ ] Track success metrics

**Announcement**:
- "🤖 New: AI Chatbot Assistant"
- "Ask questions and get instant answers from the textbook"
- "Look for the chat icon in the bottom-right corner"

**Validation**:
- [ ] All students notified
- [ ] Usage increases
- [ ] Positive feedback received

---

### Task 6.3: Post-Launch Monitoring
**Status**: Not Started
**Duration**: Ongoing
**Priority**: High
**Assignee**: Team

**Daily**:
- [ ] Check error logs
- [ ] Review OpenAI costs
- [ ] Check uptime status

**Weekly**:
- [ ] Analyze usage metrics
- [ ] Review user feedback
- [ ] Identify common questions
- [ ] Adjust retrieval if needed
- [ ] Update knowledge base if gaps found

**Monthly**:
- [ ] Comprehensive performance review
- [ ] Cost analysis
- [ ] Feature prioritization for improvements
- [ ] Content updates

**Validation**:
- [ ] Metrics tracked consistently
- [ ] Issues addressed promptly
- [ ] Continuous improvement

---

## Summary

**Total Tasks**: 39
**Estimated Duration**: 48 hours (3 weeks)
**Current Status**: 
- ✅ Complete: 5 tasks
- 🔄 In Progress: 2 tasks
- ⏳ Not Started: 32 tasks

**Critical Path**:
1. Backend Setup (Tasks 1.1-1.5)
2. API Development (Tasks 2.1-2.2)
3. Frontend Component (Tasks 3.1-3.4)
4. Deployment (Tasks 5.1-5.3)
5. Launch (Tasks 6.1-6.2)

**Next Steps**:
1. Complete Qdrant setup (Task 1.3)
2. Implement indexing pipeline (Task 1.4)
3. Build RAG pipeline (Task 1.5)
4. Develop chat endpoint (Task 2.2)
5. Build frontend UI (Task 3.2)
