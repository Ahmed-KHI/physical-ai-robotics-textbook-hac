---
sidebar_position: 3
title: Project Constitution
description: Guiding principles for this project
---

# Project Constitution

:::info View Full Document
The complete constitution is maintained in [`.github/prompts/constitution.md`](https://github.com/Ahmed-KHI/physical-ai-robotics-textbook/blob/main/.github/prompts/constitution.md)
:::

## Overview

This document defines the governing principles and development guidelines for the Physical AI & Robotics textbook platform. All features and code must align with these principles.

## Core Principles Summary

### 1. 📚 Educational Excellence
- **Clarity First**: Content must be accessible to all skill levels
- **Progressive Learning**: Build knowledge incrementally
- **Practical Focus**: Balance theory with hands-on applications
- **Inclusive Design**: Support diverse learning styles

### 2. ⚙️ Technical Standards
- **Code Quality**: Clean, maintainable, documented code
- **Performance**: Fast load times (< 3s), responsive interactions
- **Accessibility**: WCAG 2.1 AA compliance
- **Security**: Secure auth, data validation, API protection
- **Scalability**: Design for growth

### 3. 🎨 User Experience
- **Mobile-First**: Responsive design for all devices
- **Navigation**: Intuitive site structure
- **Feedback**: Immediate, helpful responses
- **Personalization**: Adapt to user skill level
- **Multilingual**: Support Urdu translation

### 4. 🤖 AI Integration Standards
- **Cost-Effective**: Use GPT-3.5-turbo (20x cheaper than GPT-4)
- **Intelligent RAG**: Context-aware responses via Qdrant
- **Accurate Citations**: Reference textbook sources
- **Error Handling**: Graceful degradation
- **Privacy**: Never expose API keys or user data

### 5. 🔧 Development Workflow
- **Spec-Driven Development**: Use Spec-Kit for planning
- **Version Control**: Meaningful Git commits
- **Documentation**: Keep README and docs current
- **Testing**: Validate before deployment
- **Continuous Deployment**: Auto-deploy via Vercel/Render

### 6. 📖 Content Organization
- **13-Week Curriculum**: Structured learning path
- **Modular Design**: Independent, reusable modules
- **Rich Media**: Diagrams, videos, code examples
- **Up-to-Date**: Reflect latest in Physical AI

### 7. 🤝 Collaboration & Open Source
- **Open Development**: Public GitHub repo
- **Community Support**: Channels for feedback
- **Academic Alignment**: Follow GIAIC standards
- **Hackathon Spirit**: Innovative solutions

## Quality Checklist

Before any feature is complete:

- ✅ Works on mobile, tablet, and desktop
- ✅ Passes accessibility audit
- ✅ Documented in code and README
- ✅ Tested with demo account
- ✅ No console errors or warnings
- ✅ Loading states and error handling
- ✅ Performance metrics acceptable
- ✅ Follows existing patterns

## Using the Constitution

### For Development
```bash
# View full constitution
/speckit.constitution
```

Check every decision against these principles:
- Does it improve educational value?
- Does it meet technical standards?
- Does it enhance user experience?
- Is it secure and performant?

### For Code Review
Ask:
1. Aligns with constitution principles? ✅/❌
2. Meets quality checklist? ✅/❌
3. Follows development workflow? ✅/❌

### For New Features
Before implementing:
1. Review relevant principles
2. Ensure alignment
3. Update specs if needed
4. Follow quality checklist

## Key Highlights

### Educational Excellence
> "All content must be clear, concise, and accessible to learners at all levels"

This means:
- Beginner-friendly explanations
- Progressive complexity
- Multiple learning modalities
- Practical examples

### Cost-Effectiveness
> "Use GPT-3.5-turbo for 20x cost savings vs GPT-4"

This means:
- Smart API usage
- Efficient prompts
- Caching when possible
- Monthly budget < $5

### Spec-Driven Development
> "Use Spec-Kit for structured feature planning"

This means:
- Define before implementing
- Document decisions
- Track progress
- Maintain specs

## Examples

### ✅ Good: Follows Constitution
```typescript
// Chatbot with error handling, loading states, and accessibility
<button 
  onClick={sendMessage}
  disabled={isLoading}
  aria-label="Send message to AI assistant"
  className={styles.sendButton}
>
  {isLoading ? <Spinner /> : 'Send'}
</button>
```

### ❌ Bad: Violates Constitution
```typescript
// No error handling, no loading state, no accessibility
<button onClick={sendMessage}>
  Send
</button>
```

## Next Steps

- [View Feature Specifications](./specifications)
- [View Implementation Plan](./implementation-plan)
- [Learn How to Use Spec-Kit](./using-speckit)

## Full Document

📄 **[View Complete Constitution on GitHub →](https://github.com/Ahmed-KHI/physical-ai-robotics-textbook/blob/main/.github/prompts/constitution.md)**
