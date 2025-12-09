import React, { useState, useEffect } from 'react';
import styles from './TranslationButton.module.css';

interface TranslationButtonProps {
  content: string;
  filePath: string;
}

export default function TranslationButton({ content, filePath }: TranslationButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState('');

  // Extract content on mount and when content changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Extract ONLY the main chapter content, excluding navigation and sidebars
      const extractChapterContent = () => {
        // Try to get the markdown content area specifically
        const markdownContent = document.querySelector('.markdown') || 
                               document.querySelector('[class*="docItemContainer"]') ||
                               document.querySelector('article');
        
        if (!markdownContent) return '';
        
        // Clone the element to manipulate it
        const clone = markdownContent.cloneNode(true) as HTMLElement;
        
        // Remove unwanted elements
        const selectorsToRemove = [
          '.pagination-nav',           // Navigation
          '.tocCollapsible',          // Table of contents
          'nav',                      // Any nav elements
          '.theme-doc-sidebar-container', // Sidebar
          '[class*="tableOfContents"]',   // TOC
          'button',                   // All buttons
          '.breadcrumbs',            // Breadcrumbs
          '[class*="PersonalizationButton"]', // Our own buttons
          '[class*="TranslationButton"]',
          'header',                  // Headers
          'footer'                   // Footers
        ];
        
        selectorsToRemove.forEach(selector => {
          clone.querySelectorAll(selector).forEach(el => el.remove());
        });
        
        // Get clean text
        const text = clone.innerText || clone.textContent || '';
        
        // Clean up extra whitespace
        return text.replace(/\n{3,}/g, '\n\n').trim();
      };
      
      const cleanContent = extractChapterContent();
      setCurrentContent(cleanContent);
    }
  }, [content]);

  const translateToUrdu = async () => {
    // Get fresh content when button is clicked
    let contentToTranslate = currentContent;
    
    if (typeof window !== 'undefined' && !contentToTranslate) {
      // Re-extract if needed
      const extractChapterContent = () => {
        const markdownContent = document.querySelector('.markdown') || 
                               document.querySelector('[class*="docItemContainer"]') ||
                               document.querySelector('article');
        
        if (!markdownContent) return '';
        
        const clone = markdownContent.cloneNode(true) as HTMLElement;
        
        const selectorsToRemove = [
          '.pagination-nav', '.tocCollapsible', 'nav', '.theme-doc-sidebar-container',
          '[class*="tableOfContents"]', 'button', '.breadcrumbs',
          '[class*="PersonalizationButton"]', '[class*="TranslationButton"]',
          'header', 'footer'
        ];
        
        selectorsToRemove.forEach(selector => {
          clone.querySelectorAll(selector).forEach(el => el.remove());
        });
        
        const text = clone.innerText || clone.textContent || '';
        return text.replace(/\n{3,}/g, '\n\n').trim();
      };
      
      contentToTranslate = extractChapterContent();
      setCurrentContent(contentToTranslate);
    }

    if (!contentToTranslate || contentToTranslate.trim().length < 10) {
      alert('No content found to translate. Please wait for the page to load completely.');
      return;
    }

    // Warn if content is long
    const MAX_CHARS = 3000;
    if (contentToTranslate.length > MAX_CHARS) {
      const proceed = confirm(
        `This page has ${contentToTranslate.length.toLocaleString()} characters. ` +
        `Only the first ${MAX_CHARS.toLocaleString()} characters will be translated to save API costs. Continue?`
      );
      if (!proceed) return;
    }

    setIsTranslating(true);

    try {
      const response = await fetch('https://physical-ai-robotics-textbook.onrender.com/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: contentToTranslate.substring(0, MAX_CHARS),
          target_language: 'ur',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Translation failed' }));
        throw new Error(errorData.detail || 'Translation failed');
      }

      const data = await response.json();
      
      if (!data.translated_content) {
        throw new Error('No translated content received');
      }
      
      setTranslatedContent(data.translated_content);
      setIsTranslated(true);
      
      // Log token usage for cost tracking (development only)
      if (data.tokens_used && data.estimated_cost_usd) {
        console.log(`✅ Translation complete: ${data.tokens_used} tokens, ~$${data.estimated_cost_usd}`);
      }
    } catch (error) {
      console.error('Error translating content:', error);
      alert(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsTranslating(false);
    }
  };

  const showOriginal = () => {
    setIsTranslated(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <button
          className={styles.translateButton}
          onClick={isTranslated ? showOriginal : translateToUrdu}
          disabled={isTranslating}
        >
          {isTranslating ? (
            <>
              <span className={styles.spinner}></span>
              Translating...
            </>
          ) : isTranslated ? (
            <>
              🇵🇰 Show Original (English)
            </>
          ) : (
            <>
              🇵🇰 Translate to Urdu | اردو میں ترجمہ کریں
            </>
          )}
        </button>
      </div>

      {currentContent && !isTranslated && (
        <div className={styles.infoText}>
          Ready to translate {Math.min(currentContent.length, 3000).toLocaleString()} characters
          {currentContent.length > 3000 && (
            <span className={styles.warning}> (truncated from {currentContent.length.toLocaleString()})</span>
          )}
          <span className={styles.costInfo}> • Est. cost: ~$0.002</span>
        </div>
      )}

      {isTranslated && translatedContent && (
        <div className={styles.translatedContent}>
          <div className={styles.contentHeader}>
            <span className={styles.badge}>
              🇵🇰 اردو ترجمہ | Urdu Translation
            </span>
            <span className={styles.note}>
              AI-powered • GPT-3.5-turbo
            </span>
          </div>
          <div 
            className={`${styles.content} ${styles.urduText}`}
            dangerouslySetInnerHTML={{ __html: translatedContent }}
          />
        </div>
      )}
    </div>
  );
}
