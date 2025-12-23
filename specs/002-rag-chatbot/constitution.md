# Constitution: RAG Chatbot

## Feature Purpose
Provide an intelligent, context-aware AI assistant that answers student questions using Retrieval-Augmented Generation (RAG) technology, enhancing the learning experience with instant, accurate responses grounded in textbook content.

## Core Principles

### 1. Accuracy & Reliability
- **Source-Grounded**: All answers must be based on textbook content stored in vector database
- **Citation**: Always reference relevant chapters or sections when possible
- **No Hallucination**: If information isn't in the textbook, admit it instead of making up answers
- **Confidence Scoring**: Internal evaluation of answer quality before presenting to users
- **Error Handling**: Graceful degradation when APIs fail or context is insufficient

### 2. User Experience
- **Fast Responses**: Target < 5 seconds for answer generation
- **Conversational**: Natural, friendly tone appropriate for educational context
- **Context Awareness**: Remember conversation history within session
- **Text Selection**: Support "Ask about selection" for highlighted text
- **Loading States**: Clear indicators when processing queries
- **Error Messages**: Helpful, actionable error feedback

### 3. Technical Excellence
- **Cost-Effective**: Use GPT-3.5-turbo to keep API costs under $3/month
- **Scalable**: Qdrant cloud vector database for efficient similarity search
- **Modular**: Clean separation of RAG logic, API endpoints, and UI components
- **Tested**: Validate RAG accuracy with test queries before deployment
- **Monitored**: Log queries and responses for quality improvement

### 4. AI Integration Standards
- **Prompt Engineering**: Well-crafted system prompts for consistent behavior
- **Temperature Control**: Use 0.7 for balanced creativity vs accuracy
- **Token Management**: Stay within context limits (4096 tokens for GPT-3.5)
- **Embeddings**: Use OpenAI ada-002 for consistent vector representation
- **Chunking**: Break textbook into ~500 token chunks for optimal retrieval

### 5. Security & Privacy
- **No PII Storage**: Don't log personally identifiable information
- **API Key Security**: Store OpenAI/Qdrant keys in backend environment variables only
- **Rate Limiting**: Prevent API abuse and cost explosion
- **Input Sanitization**: Clean user inputs before processing
- **CORS Protection**: Only allow requests from authorized frontend domains

## Implementation Guidelines

### RAG Pipeline
1. **Index Content**: Process all textbook MDX files → chunks → embeddings → Qdrant
2. **Query Processing**: Embed user question → retrieve top 5 similar chunks
3. **Context Building**: Format retrieved chunks with metadata (chapter, section)
4. **Prompt Construction**: System prompt + context + user question + chat history
5. **Response Generation**: Call GPT-3.5-turbo with complete prompt
6. **Answer Delivery**: Stream or return complete response to frontend

### Chatbot UI
1. **Floating Widget**: Bottom-right corner, non-intrusive
2. **Expandable**: Minimized ↔ Full chat interface
3. **Message History**: Show conversation flow with timestamps
4. **Quick Actions**: Pre-defined question buttons for common queries
5. **Text Selection Banner**: Appears when user highlights text
6. **Mobile Optimized**: Responsive layout, touch-friendly

### Error Handling
1. **OpenAI Errors**: Retry logic with exponential backoff
2. **Qdrant Errors**: Fallback to general GPT response without RAG
3. **Network Errors**: Show friendly message, allow retry
4. **Timeout Handling**: Cancel requests after 30 seconds
5. **User Feedback**: Allow users to report poor answers

## Quality Checklist

### Before Committing
- [ ] RAG retrieves relevant chunks for test queries
- [ ] Answers cite textbook content accurately
- [ ] Conversation context maintained across messages
- [ ] Text selection feature works on all pages
- [ ] Loading states visible during processing
- [ ] Error messages helpful and user-friendly
- [ ] Mobile chat interface usable
- [ ] No console errors in browser

### Before Deployment
- [ ] Vector database properly indexed with all content
- [ ] API keys configured in production environment
- [ ] CORS allows requests from production domain
- [ ] Rate limiting configured on backend
- [ ] Tested with 20+ diverse queries
- [ ] Performance acceptable (< 5s response time)
- [ ] Cost projection reasonable (< $5/month)
- [ ] Backend health check endpoint working

## Success Metrics

### Performance
- Response time < 5 seconds (95th percentile)
- RAG retrieval accuracy > 80% (relevant chunks)
- Uptime > 99% (backend availability)
- API cost < $3/month

### User Experience
- Clear, accurate answers to common questions
- Conversation flows naturally
- Text selection feature discoverable
- Mobile interface usable without frustration
- Zero crashes or freezes

### Content Quality
- Answers grounded in textbook content
- Appropriate technical depth
- No hallucinated information
- Citations when possible
- Admits when info not available

## Non-Negotiables

1. **Accuracy First**: Never sacrifice accuracy for speed
2. **Source Grounding**: All answers must use RAG retrieval
3. **Cost Control**: API spending must stay under budget
4. **Mobile Functional**: Must work on smartphones
5. **Error Handling**: Never show raw error messages to users
6. **Privacy**: Don't log user identifiable information
7. **Performance**: Must respond in under 10 seconds worst case

## Future Enhancements
- Voice input/output for questions
- Multi-modal support (images in questions/answers)
- Fine-tuned model on textbook content
- Suggested follow-up questions
- Conversation export/save feature
- Admin dashboard for query analytics
- A/B testing different RAG strategies
