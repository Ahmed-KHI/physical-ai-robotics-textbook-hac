# Quickstart: Docusaurus Textbook Site

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18.x or higher
- npm 10.x or higher
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Ahmed-KHI/physical-ai-robotics-textbook-hac.git
cd physical-ai-robotics-textbook-hac

# Install dependencies
npm install

# Start development server
npm start
```

The site will open at `http://localhost:3000`

### Project Structure
```
├── docs/              # Textbook content (MDX files)
│   ├── module-1/     # Week 1
│   ├── module-2/     # Weeks 2-3
│   ├── module-3/     # Weeks 4-7
│   └── module-4/     # Weeks 8-13
├── src/
│   ├── components/   # React components
│   ├── pages/        # Custom pages
│   └── css/          # Styles
├── static/           # Static assets
├── docusaurus.config.ts  # Configuration
└── sidebars.ts       # Navigation structure
```

### Key Commands

```bash
# Development
npm start              # Start dev server with hot reload

# Build
npm run build          # Production build
npm run serve          # Preview production build

# Deployment
git push origin main   # Auto-deploys to Vercel
```

### Adding Content

1. Create MDX file in `docs/module-X/`
2. Add to `sidebars.ts`
3. Write content with frontmatter:

```mdx
---
sidebar_position: 1
title: Chapter Title
---

# Content here
```

### Customization

- **Theme**: Edit `src/css/custom.css`
- **Navbar**: Modify `docusaurus.config.ts` → `themeConfig.navbar`
- **Footer**: Modify `docusaurus.config.ts` → `themeConfig.footer`
- **Components**: Add to `src/components/`

### Troubleshooting

**Build fails:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port already in use:**
```bash
npm start -- --port 3001
```

### Next Steps

- Read [spec.md](./spec.md) for feature details
- Review [plan.md](./plan.md) for architecture
- Check [tasks.md](./tasks.md) for implementation status
- See [constitution.md](./constitution.md) for principles

### Live Demo
**Production**: https://physical-ai-robotics-textbook-hac.vercel.app

### Support
- **Documentation**: `/docs` folder
- **Issues**: GitHub Issues
- **Contact**: Ahmed Khan
