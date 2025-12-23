# Constitution: Docusaurus Textbook Site

## Feature Purpose
Create a comprehensive, professional digital textbook platform for Physical AI and Humanoid Robotics using Docusaurus, providing structured educational content across 13 weeks with excellent navigation, search, and user experience.

## Core Principles

### 1. Educational Excellence
- **Content Quality**: All content must be technically accurate, well-researched, and peer-reviewed
- **Progressive Learning**: Structure content from fundamentals to advanced topics
- **Clear Examples**: Every concept must include practical examples and code samples
- **Visual Learning**: Use diagrams, images, and videos where applicable
- **Accessibility**: Content readable for beginners while valuable for advanced learners

### 2. Technical Standards
- **Static Generation**: Leverage Docusaurus SSG for optimal performance
- **TypeScript**: Use TypeScript for type safety and better developer experience
- **React Best Practices**: Follow React 19 patterns and conventions
- **MDX Support**: Combine Markdown with React components for interactive content
- **SEO Optimization**: Ensure proper meta tags, sitemaps, and structured data

### 3. User Experience
- **Fast Loading**: Target < 3s page load time
- **Intuitive Navigation**: Clear sidebar, breadcrumbs, and table of contents
- **Responsive Design**: Mobile-first approach, works on all devices
- **Search Functionality**: Fast, accurate search across all content
- **Dark Mode**: Support both light and dark themes
- **Accessibility**: WCAG 2.1 AA compliance

### 4. Content Structure
- **Modular Organization**: 4 modules, 13 weeks of content
- **Consistent Formatting**: Use templates for chapters and sections
- **Progressive Disclosure**: Hide complexity until needed
- **Clear Learning Paths**: Guide students through curriculum logically
- **Self-Contained Chapters**: Each chapter should be understandable independently

### 5. Development Workflow
- **Version Control**: All changes committed to Git with clear messages
- **Documentation**: Document component APIs and usage
- **Testing**: Test navigation, links, and content rendering
- **Performance**: Monitor and optimize bundle size and load times
- **Continuous Deployment**: Auto-deploy to Vercel on main branch push

## Implementation Guidelines

### Content Creation
1. Write content in MDX files for rich interactivity
2. Use consistent heading hierarchy (H1 for title, H2 for sections)
3. Include code examples with syntax highlighting
4. Add alt text to all images
5. Link to related chapters where relevant

### Component Development
1. Create reusable components in `src/components/`
2. Use CSS Modules for styling isolation
3. Ensure components are mobile-responsive
4. Add proper TypeScript types
5. Document props and usage

### Configuration
1. Keep `docusaurus.config.ts` organized and commented
2. Use plugins sparingly to avoid bloat
3. Configure proper metadata for SEO
4. Set up analytics and monitoring
5. Enable useful features (algolia search, blog, etc.)

### Styling
1. Use CSS custom properties for theming
2. Follow mobile-first responsive design
3. Maintain consistent spacing and typography
4. Use Docusaurus theme tokens where possible
5. Keep custom CSS minimal and organized

## Quality Checklist

### Before Committing
- [ ] All content proofread for grammar and accuracy
- [ ] Code examples tested and working
- [ ] Links verified (internal and external)
- [ ] Images optimized and have alt text
- [ ] Mobile layout tested
- [ ] No console errors or warnings
- [ ] Build succeeds locally (`npm run build`)

### Before Deployment
- [ ] All pages render correctly
- [ ] Navigation works on all pages
- [ ] Search returns relevant results
- [ ] Responsive on mobile, tablet, desktop
- [ ] Lighthouse score > 90
- [ ] No broken links
- [ ] Proper meta descriptions
- [ ] Sitemap generated

## Success Metrics

### Performance
- Page load time < 3 seconds
- First Contentful Paint < 1.5s
- Lighthouse Performance > 90
- Bundle size < 500KB (gzipped)

### User Experience
- Clear navigation structure
- Search finds relevant content
- Mobile usable without zooming
- All content accessible
- Zero broken links

### Content
- 13 weeks of comprehensive curriculum
- 4 well-structured modules
- Code examples in all chapters
- Visual aids where needed
- Consistent formatting throughout

## Non-Negotiables

1. **No Broken Links**: Every link must work
2. **Mobile Responsive**: Must work on small screens
3. **Fast Loading**: No page > 3s load time
4. **Accessible**: Must meet WCAG AA standards
5. **SEO Optimized**: Proper metadata on every page
6. **Type Safe**: No TypeScript `any` without justification
7. **Clean Build**: Zero build errors or warnings

## Future Enhancements
- Interactive code playgrounds
- Video tutorials
- Progress tracking
- Quizzes and assessments
- Community discussions
- Certificate generation
