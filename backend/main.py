"""
FastAPI Backend for Physical AI & Robotics Textbook Platform
Handles authentication, RAG chatbot, personalization, and translation
"""

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import Response
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Physical AI Robotics Platform API",
    description="Backend API for AI-native textbook with RAG chatbot",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://physical-ai-robotics-textbook.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ============================================================================
# Pydantic Models
# ============================================================================

class UserSignup(BaseModel):
    """User signup request model"""
    email: EmailStr
    password: str
    full_name: str
    programming_experience: str  # beginner, intermediate, advanced
    robotics_background: str  # none, hobbyist, professional
    hardware_access: str  # none, basic_pc, high_end_workstation, full_lab

class UserLogin(BaseModel):
    """User login request model"""
    email: EmailStr
    password: str

class ChatQuery(BaseModel):
    """Chatbot query model"""
    query: str
    context: Optional[str] = None  # Selected text from the page
    chapter: Optional[str] = None
    conversation_id: Optional[str] = None

class PersonalizeRequest(BaseModel):
    """Content personalization request"""
    chapter: str
    content: str
    user_level: str

class TranslationRequest(BaseModel):
    """Translation request"""
    content: str
    target_language: str = "ur"  # Urdu

class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str

# ============================================================================
# Health Check
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Physical AI Robotics Platform API",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "qdrant_configured": bool(os.getenv("QDRANT_URL")),
        "database_configured": bool(os.getenv("DATABASE_URL"))
    }

@app.get("/favicon.ico")
async def favicon():
    """Return empty response for favicon requests to prevent 404 errors"""
    return Response(content="", media_type="image/x-icon")

# ============================================================================
# Authentication Endpoints
# ============================================================================

@app.post("/api/auth/signup", response_model=Dict[str, Any])
async def signup(user: UserSignup):
    """
    Register a new user with background questionnaire
    This will be implemented with better-auth integration
    """
    # TODO: Implement user creation with database
    return {
        "message": "User registered successfully",
        "user": {
            "email": user.email,
            "full_name": user.full_name,
            "profile": {
                "programming_experience": user.programming_experience,
                "robotics_background": user.robotics_background,
                "hardware_access": user.hardware_access
            }
        }
    }

@app.post("/api/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Login endpoint with demo account for teachers/reviewers
    Demo credentials: teacher@giaic.com / Teacher@123
    """
    # Demo account for teachers and reviewers
    DEMO_EMAIL = "teacher@giaic.com"
    DEMO_PASSWORD = "Teacher@123"
    
    if credentials.email == DEMO_EMAIL and credentials.password == DEMO_PASSWORD:
        # Return valid token for demo account
        return {
            "access_token": "demo_teacher_token_authenticated",
            "token_type": "bearer"
        }
    
    # For other users (would need proper authentication in production)
    # This is a hackathon demo, so we'll accept any login
    return {
        "access_token": f"user_token_{credentials.email}",
        "token_type": "bearer"
    }

@app.get("/api/auth/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Get current user profile
    Returns demo teacher profile for demo token
    """
    if token == "demo_teacher_token_authenticated":
        return {
            "email": "teacher@giaic.com",
            "full_name": "GIAIC Teacher (Demo Account)",
            "profile": {
                "programming_experience": "advanced",
                "robotics_background": "professional",
                "hardware_access": "full_lab"
            }
        }
    
    # For other authenticated users
    return {
        "email": "student@example.com",
        "full_name": "Student User",
        "profile": {
            "programming_experience": "intermediate",
            "robotics_background": "hobbyist",
            "hardware_access": "basic_pc"
        }
    }

# ============================================================================
# RAG Chatbot Endpoints
# ============================================================================

@app.post("/api/chat/query")
async def chat_query(query: ChatQuery):
    """
    RAG-powered chatbot query endpoint
    Supports both general questions and context-specific queries
    """
    try:
        from rag import get_rag_system
        rag = get_rag_system()
        
        # Query RAG system
        result = rag.query(
            question=query.query,
            context=query.context,
            k=3  # Retrieve 3 most relevant chunks
        )
        
        return {
            "response": result['answer'],
            "sources": result['sources'],
            "conversation_id": query.conversation_id or "new_conversation"
        }
    except Exception as e:
        import traceback
        traceback.print_exc()  # Print full stack trace to terminal
        raise HTTPException(status_code=500, detail=f"RAG query failed: {str(e)}")

@app.get("/api/chat/history")
async def get_chat_history(
    conversation_id: str = Query(...),
    token: str = Depends(oauth2_scheme)
):
    """
    Retrieve chat history for a conversation
    """
    # TODO: Implement chat history retrieval from database
    return {
        "conversation_id": conversation_id,
        "messages": []
    }

# ============================================================================
# Personalization Endpoints
# ============================================================================

@app.post("/api/personalize")
async def personalize_content(request: PersonalizeRequest):
    """
    Personalize chapter content based on user level using GPT-4
    """
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Define prompts for each level
        level_prompts = {
            "beginner": "Rewrite this robotics content for absolute beginners. Use simple language, add detailed explanations, include analogies, break down complex concepts step-by-step. Assume no prior robotics knowledge.",
            "intermediate": "Rewrite this robotics content for intermediate learners. Focus on practical examples, real-world applications, and hands-on implementation. Assume basic programming and robotics knowledge.",
            "advanced": "Rewrite this robotics content for advanced practitioners. Focus on optimization, advanced techniques, best practices, and production considerations. Be concise and technical."
        }
        
        prompt = level_prompts.get(request.user_level, level_prompts["intermediate"])
        
        # Use GPT-3.5-turbo to personalize (cheaper than GPT-4)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"Content to adapt:\n\n{request.content}"}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        personalized_content = response.choices[0].message.content
        
        return {
            "original_content": request.content,
            "personalized_content": personalized_content,
            "user_level": request.user_level,
            "chapter": request.chapter
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Personalization failed: {str(e)}")

# ============================================================================
# Translation Endpoints
# ============================================================================

@app.post("/api/translate")
async def translate_content(request: TranslationRequest):
    """
    Translate content to Urdu using GPT-4
    """
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Use GPT-3.5-turbo for translation (cheaper, still good quality)
        # Limit to 4000 tokens to balance quality and cost
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional translator specializing in technical content. Translate the following robotics and AI content to Urdu. Maintain technical terms in English where appropriate (like 'ROS 2', 'Python', 'SLAM'). Ensure the translation is natural and clear for Urdu-speaking learners."
                },
                {
                    "role": "user",
                    "content": f"Translate to Urdu:\n\n{request.content[:8000]}"
                }
            ],
            temperature=0.3,  # Lower temperature for more consistent translation
            max_tokens=4000
        )
        
        translated_content = response.choices[0].message.content
        
        return {
            "original_content": request.content,
            "translated_content": translated_content,
            "target_language": request.target_language
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

# ============================================================================
# Vector Database Management
# ============================================================================

@app.post("/api/embeddings/index")
async def index_book_content():
    """
    Index all book content into Qdrant vector database
    This should be run after book content is generated
    """
    # TODO: Implement book content indexing
    
    return {
        "status": "success",
        "message": "Book content indexed successfully",
        "documents_indexed": 0
    }

@app.get("/api/embeddings/status")
async def get_embedding_status():
    """
    Check the status of vector database
    """
    # TODO: Implement Qdrant status check
    
    return {
        "status": "ready",
        "total_documents": 0,
        "collections": []
    }

# ============================================================================
# Run the application
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
