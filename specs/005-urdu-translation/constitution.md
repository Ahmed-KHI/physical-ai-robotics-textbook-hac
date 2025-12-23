# Constitution: Urdu Translation System

## Feature Purpose
Democratize access to Physical AI and Robotics education by providing high-quality Urdu translations of all textbook content, making the curriculum accessible to Pakistan's 70+ million Urdu speakers and supporting inclusive technical education in South Asia.

## Core Principles

### 1. Translation Quality & Accuracy
- **Semantic Fidelity**: Translations must preserve meaning, not just word-for-word conversion
- **Technical Precision**: Technical terms (AI, robotics, algorithms) handled consistently
- **Context-Aware**: Understanding of subject matter to maintain educational value
- **Grammatical Correctness**: Proper Urdu grammar, sentence structure, and punctuation
- **Readability**: Natural, fluent Urdu that feels native, not machine-translated
- **Verification**: Spot-check translations against known-good examples
- **Iterative Improvement**: Learn from user feedback to enhance quality

### 2. Cultural Sensitivity & Localization
- **Cultural Adaptation**: Examples and analogies relevant to Pakistani/South Asian context
- **Respectful Language**: Appropriate formality and respectful tone
- **Local Examples**: Where possible, reference local institutions, industries, contexts
- **Inclusive Language**: Gender-neutral and inclusive terminology
- **Educational Tone**: Maintain the instructional and encouraging voice
- **Religious Sensitivity**: Respect cultural and religious considerations
- **Script Standards**: Use proper Urdu Nastaliq script conventions

### 3. Accessibility & Usability
- **RTL Support**: Proper right-to-left text rendering and layout
- **Font Selection**: Use high-quality Urdu fonts (Noto Nastaliq Urdu)
- **Readability**: Appropriate font size, line spacing, text contrast
- **Toggle Functionality**: Seamless switching between English and Urdu
- **Visual Clarity**: Clear indication of which language is displayed
- **Keyboard Support**: Support for Urdu keyboard input if needed
- **Mobile Responsive**: Urdu text renders correctly on all devices
- **Screen Reader**: Compatible with Urdu screen readers

### 4. Technical Excellence
- **Performance**: Translations cached to avoid repeated API calls
- **Loading States**: Clear indicators during 10-15 second translation process
- **Error Handling**: Graceful failures with fallback to English
- **Cost Management**: GPT-3.5-turbo to keep translation costs sustainable (~$0.002/page)
- **Scalability**: Cache strategy supports growing content library
- **Modularity**: Clean separation of translation logic, caching, and UI
- **Testing**: Validate translation pipeline with sample content
- **Monitoring**: Track translation requests, cache hits, API costs

### 5. Content Preservation
- **Markdown Formatting**: Preserve headings, lists, emphasis, links
- **Code Blocks**: Keep all code unchanged (don't translate programming code)
- **Code Comments**: Translate comments within code for understanding
- **Technical Terms**: Maintain English terms with Urdu explanations where needed
- **Mathematical Notation**: Preserve LaTeX/KaTeX equations unchanged
- **Images/Diagrams**: Keep image references, translate alt text
- **Links**: Maintain all hyperlinks and references
- **Structure**: Preserve document hierarchy and organization

## Implementation Guidelines

### Translation Pipeline
1. **Content Extraction**: Parse MDX file to identify translatable sections
2. **Content Segmentation**: Separate headings, paragraphs, code blocks, comments
3. **Smart Translation**: Send text to GPT-3.5-turbo with specialized prompt
4. **Post-Processing**: Reconstruct markdown structure with translated content
5. **Caching**: Store translations in local storage or backend database
6. **Rendering**: Apply RTL CSS, Urdu fonts, and layout adjustments

### Prompt Engineering
```
You are a technical translator specializing in educational content translation from English to Urdu.

Task: Translate the following robotics/AI educational content to Urdu.

Requirements:
1. Maintain technical accuracy and educational tone
2. Keep technical terms in English followed by Urdu explanation: "Artificial Intelligence (مصنوعی ذہانت)"
3. Use clear, natural Urdu that students can understand
4. Preserve markdown formatting (headings: #, lists: -, emphasis: **)
5. DO NOT translate: code blocks, variable names, function names, URLs
6. DO translate: code comments, documentation strings
7. Use appropriate technical vocabulary for Pakistani audience
8. Maintain formal but friendly educational tone

Content to translate:
[CONTENT_HERE]

Provide only the translated text, maintaining exact markdown structure.
```

### Caching Strategy
- **Key Format**: `translation_${pageSlug}_${contentHash}_ur`
- **Storage**: Browser localStorage for client-side caching
- **TTL**: 30 days for translated content
- **Invalidation**: Clear cache when original content updates
- **Fallback**: If cache fails, fetch from API and warn user
- **Pre-Translation**: Option to pre-translate high-traffic pages

### RTL Implementation
```css
[dir="rtl"] {
  direction: rtl;
  text-align: right;
  font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;
}

[dir="rtl"] code {
  direction: ltr;  /* Code always LTR */
  text-align: left;
}

[dir="rtl"] .markdown-content {
  font-size: 1.125rem;  /* Slightly larger for Urdu readability */
  line-height: 2;       /* More spacing for Nastaliq script */
}
```

## Success Metrics

### Quality Metrics
- Translation accuracy > 90% (human evaluation)
- User satisfaction > 4.0/5.0 for translated content
- < 5% user reports of translation errors
- Technical term consistency > 95%

### Performance Metrics
- Average translation time < 15 seconds
- Cache hit rate > 80% after 1 week
- API cost < $10/month for 1000 active users
- UI toggle response time < 100ms

### Adoption Metrics
- 30% of Pakistani users enable Urdu translation
- 20% increase in time-on-page for Urdu users
- 15% increase in course completion for Urdu users
- Positive feedback from Urdu-speaking community

### Accessibility Metrics
- WCAG 2.1 AA compliance for RTL layout
- Mobile usability score > 90
- Font rendering correct on 95%+ devices
- Screen reader compatibility verified

## Constraints & Considerations

### Technical Constraints
- OpenAI API rate limits: 3 requests/minute (free tier)
- Context window: 4096 tokens for GPT-3.5-turbo
- Long pages must be chunked into smaller sections
- Translation time scales with content length
- Cache storage limited by browser localStorage (5-10MB)

### Linguistic Constraints
- Some technical terms have no direct Urdu equivalent
- Urdu script requires special font handling
- RTL layout affects code positioning
- Mixed directionality (LTR code in RTL text) requires careful CSS

### Cultural Constraints
- Educational content must remain culturally appropriate
- Examples should be relevant but not require major rewrites
- Balance between technical English terms and Urdu explanations
- Formal vs informal Urdu (choose formal for educational content)

### Cost Constraints
- GPT-3.5-turbo: ~$0.002 per typical page (1000 tokens in + out)
- Budget: Keep total translation costs under $20/month
- Cache heavily to minimize API calls
- Consider pre-translating popular pages to reduce on-demand costs

## Quality Assurance

### Pre-Launch Validation
- [ ] Translate 10 sample pages manually for ground truth
- [ ] Compare automated translations to manual translations
- [ ] Test with native Urdu speakers (Pakistan/India)
- [ ] Verify RTL layout on multiple browsers/devices
- [ ] Test caching mechanism thoroughly
- [ ] Load test with multiple concurrent translations
- [ ] Verify all markdown formatting preserved

### Post-Launch Monitoring
- [ ] Track translation error reports
- [ ] Monitor API costs and cache hit rates
- [ ] Collect user feedback on translation quality
- [ ] A/B test different prompts for quality improvement
- [ ] Regular spot-checks of new translations
- [ ] Community review process for iterative improvement

## Future Enhancements

### Phase 2 (Post-Launch)
- Human-in-the-loop review for critical pages
- Community contributions for translation improvements
- Additional languages (Hindi, Bengali, Arabic)
- Offline translation caching for mobile apps
- Translation memory for consistency across pages
- Fine-tuned translation model for better quality

### Phase 3 (Long-term)
- Professional translator review and certification
- Urdu audio narration of translated content
- Urdu video subtitles for embedded videos
- Urdu-language chatbot for Q&A
- Collaborative translation platform
- Translation quality scoring and improvement system
