/**
 * AI Chatbot Component
 * Floating chatbot widget with RAG capabilities
 */

import React, { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for text selection
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 10) {
        setSelectedText(text);
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, []);

  // Toggle chatbot
  useEffect(() => {
    const triggerButton = document.getElementById('chatbot-trigger');
    if (triggerButton) {
      triggerButton.addEventListener('click', () => setIsOpen(true));
    }
    return () => {
      if (triggerButton) {
        triggerButton.removeEventListener('click', () => setIsOpen(true));
      }
    };
  }, []);

  const sendMessage = async (customMessage?: string) => {
    const messageText = customMessage || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call backend API
      const response = await fetch('http://localhost:8000/api/chat/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: messageText,
          context: selectedText || null,
          chapter: getCurrentChapter(),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSelectedText(''); // Clear selected text after use
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I am currently unavailable. Please try again later.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentChapter = () => {
    // Extract chapter from URL or page title
    const path = window.location.pathname;
    const match = path.match(/docs\/(.*)/);
    return match ? match[1] : 'unknown';
  };

  const startNewChat = () => {
    setMessages([]);
    setSelectedText('');
  };

  const quickQuestions = [
    'What are the hardware requirements?',
    'Explain ROS 2 basics',
    'How does SLAM work?',
    'What is Physical AI?',
  ];

  if (!isOpen) {
    return (
      <button
        className={styles.chatbotButton}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
      >
        💬
      </button>
    );
  }

  return (
    <div className={`${styles.chatbotContainer} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.chatbotHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.logoCircle}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.3"/>
              <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h3>AI Assistant</h3>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Minimize" : "Expand"}
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? '⤓' : '⤢'}
          </button>
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Close chatbot"
          >
            ✕
          </button>
        </div>
      </div>

      {selectedText && (
        <div className={styles.selectedTextBanner}>
          <span>📝 Selected text detected</span>
          <button
            onClick={() => sendMessage(`Explain this: "${selectedText}"`)}
            className={styles.askAboutSelection}
          >
            Ask about selection
          </button>
          <button onClick={() => setSelectedText('')} className={styles.clearSelection}>
            ✕
          </button>
        </div>
      )}

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.welcomeMessage}>
            <div className={styles.welcomeLogo}>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" fill="url(#logoGrad)"/>
                <path d="M24 8L12 16L24 24L36 16L24 8Z" fill="white" opacity="0.9"/>
                <path d="M12 32L24 40L36 32V24L24 32L12 24V32Z" fill="white"/>
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stopColor="#10b981"/>
                    <stop offset="100%" stopColor="#059669"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h4>Greetings! 👋</h4>
            <p>Ready to dive in? Choose a question to get started!</p>
            <div className={styles.quickQuestions}>
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} className={styles.quickQuestion}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.newChatBanner}>
              <button onClick={startNewChat} className={styles.newChatButton}>
                ↻ Start New Chat
              </button>
            </div>
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                <div className={styles.messageContent}>{msg.content}</div>
                <div className={styles.messageTime}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </>
        )}
        {isLoading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.typing}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask a question..."
          className={styles.input}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
          className={styles.sendButton}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
