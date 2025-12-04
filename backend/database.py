"""
Database models and operations
Uses SQLAlchemy with Neon Serverless Postgres
"""

from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    """User model with profile information"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # User profile for personalization
    programming_experience = Column(String)  # beginner, intermediate, advanced
    robotics_background = Column(String)  # none, hobbyist, professional
    hardware_access = Column(String)  # none, basic_pc, high_end_workstation, full_lab
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Conversation(Base):
    """Chat conversation history"""
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    conversation_id = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Message(Base):
    """Individual chat messages"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(String, index=True)
    role = Column(String)  # user or assistant
    content = Column(Text)
    context = Column(Text, nullable=True)  # Selected text context
    chapter = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class PersonalizationCache(Base):
    """Cache personalized content"""
    __tablename__ = "personalization_cache"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    chapter = Column(String)
    user_level = Column(String)
    original_content_hash = Column(String)
    personalized_content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class TranslationCache(Base):
    """Cache translated content"""
    __tablename__ = "translation_cache"
    
    id = Column(Integer, primary_key=True, index=True)
    chapter = Column(String)
    target_language = Column(String)
    original_content_hash = Column(String)
    translated_content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialized successfully!")
