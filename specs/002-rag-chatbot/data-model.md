# Data Model: Docusaurus Textbook Site

## Overview
This feature is a static-generated textbook site, so it doesn't have a traditional database. Data is stored in:
- MDX files (content)
- Configuration files (settings)
- Static assets (images, etc.)

## Content Structure

### MDX Files
```typescript
interface MDXFrontmatter {
  title: string;                    // Page title
  sidebar_position?: number;        // Order in sidebar
  sidebar_label?: string;           // Custom sidebar label
  description?: string;             // Meta description
  keywords?: string[];              // SEO keywords
  hide_title?: boolean;             // Hide H1 title
  hide_table_of_contents?: boolean; // Hide TOC
}
```

**Example:**
```mdx
---
title: "Introduction to Physical AI"
sidebar_position: 1
description: "Learn the fundamentals of Physical AI"
keywords: ["physical AI", "robotics", "introduction"]
---

# Content here...
```

### Sidebar Configuration
```typescript
// sidebars.ts
interface Sidebar {
  type: 'category' | 'doc' | 'link';
  label: string;
  items?: SidebarItem[];
  collapsed?: boolean;
  collapsible?: boolean;
}
```

**Example:**
```typescript
{
  type: 'category',
  label: 'Module 1: Introduction',
  collapsed: false,
  items: [
    'module-1/intro',
    'module-1/week-1'
  ]
}
```

### Docusaurus Config
```typescript
interface DocusaurusConfig {
  title: string;
  tagline: string;
  url: string;
  baseUrl: string;
  themeConfig: {
    navbar: NavbarConfig;
    footer: FooterConfig;
    prism: PrismConfig;
  };
  presets: Preset[];
}
```

## File System Structure

### Content Hierarchy
```
docs/
  ├── intro.mdx                    # Root intro page
  ├── setup.md                     # Setup guide
  ├── hardware.md                  # Hardware requirements  
  ├── faq.md                       # FAQ
  │
  ├── module-1/                    # Module directory
  │   ├── intro.mdx               # Module intro
  │   ├── week-1.mdx              # Chapter
  │   └── img/                    # Module images
  │
  ├── module-2/
  │   ├── intro.mdx
  │   ├── week-2.mdx
  │   └── week-3.mdx
  │
  ├── module-3/
  │   ├── intro.mdx
  │   ├── week-4.mdx
  │   ├── week-5.mdx
  │   ├── week-6.mdx
  │   └── week-7.mdx
  │
  └── module-4/
      ├── intro.mdx
      ├── week-8.mdx
      ├── week-9.mdx
      ├── week-10.mdx
      ├── week-11.mdx
      ├── week-12.mdx
      └── week-13.mdx
```

### Build Output Structure
```
build/
  ├── index.html                   # Homepage
  ├── docs/                        # All doc pages
  │   ├── intro/index.html
  │   ├── module-1/
  │   │   ├── intro/index.html
  │   │   └── week-1/index.html
  │   └── ...
  ├── assets/                      # Bundled assets
  │   ├── css/
  │   ├── js/
  │   └── images/
  └── sitemap.xml                  # SEO sitemap
```

## Static Assets

### Images
```typescript
// Stored in static/img/
interface ImageAsset {
  path: string;        // e.g., "/img/logo.svg"
  alt: string;         // Accessibility text
  width?: number;      // Optional dimensions
  height?: number;
}
```

### Usage in MDX:
```mdx
![Robot Diagram](/img/module-1/robot-diagram.png)
```

## Navigation Data Model

### Navbar
```typescript
interface NavbarItem {
  type: 'doc' | 'docSidebar' | 'page' | 'dropdown' | 'link';
  label: string;
  position: 'left' | 'right';
  to?: string;
  items?: NavbarItem[];
}
```

### Footer
```typescript
interface FooterLink {
  label: string;
  to?: string;
  href?: string;
}

interface FooterColumn {
  title: string;
  items: FooterLink[];
}
```

## Theme Configuration

### Color Scheme
```css
:root {
  --ifm-color-primary: #2e8555;
  --ifm-color-primary-dark: #29784c;
  --ifm-color-primary-darker: #277148;
  --ifm-color-primary-darkest: #205d3b;
  --ifm-color-primary-light: #33925d;
  --ifm-color-primary-lighter: #359962;
  --ifm-color-primary-lightest: #3cad6e;
}
```

## Search Index

### Algolia DocSearch (if enabled)
```typescript
interface SearchConfig {
  appId: string;
  apiKey: string;
  indexName: string;
  contextualSearch: boolean;
  searchParameters: {
    facetFilters?: string[];
  };
}
```

## Metadata

### Page Metadata
```typescript
interface PageMeta {
  title: string;                // <title>
  description: string;          // <meta name="description">
  keywords: string[];           // <meta name="keywords">
  image?: string;               // Open Graph image
  author?: string;              // <meta name="author">
  robots?: string;              // <meta name="robots">
}
```

### Generated Automatically:
- Canonical URLs
- Open Graph tags
- Twitter Card tags
- JSON-LD structured data

## Build-Time Data

### Generated Files
```
.docusaurus/
  ├── docusaurus.config.mjs       # Resolved config
  ├── globalData.json             # Site metadata
  ├── routesChunkNames.json       # Code splitting
  └── registry.json               # Plugin registry
```

## Performance Optimization

### Code Splitting
Each route gets its own JS bundle:
```
assets/js/
  ├── main.[hash].js              # Core bundle
  ├── runtime~main.[hash].js      # Webpack runtime
  ├── [route].[hash].js           # Per-route bundles
  └── vendors.[hash].js           # Dependencies
```

### Asset Optimization
- Images: WebP with PNG/JPG fallback
- CSS: Minified and combined
- JS: Minified and tree-shaken
- Fonts: Subset and optimized

## No Database Required

This is a **static site** - all data is:
- **Content**: MDX files committed to Git
- **Configuration**: TypeScript/JSON files
- **Assets**: Images and files in `static/`
- **Build Output**: Static HTML/CSS/JS in `build/`

No runtime database needed. All content is version-controlled and deployed as static files to Vercel CDN.

## Future Enhancements

If database needed later:
- User progress tracking → PostgreSQL
- Comments system → Firebase
- Analytics → Custom DB
- User profiles → Auth + DB

But for textbook content, file-based approach is optimal.
