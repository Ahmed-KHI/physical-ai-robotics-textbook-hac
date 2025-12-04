import React, { useState } from 'react';
import styles from './TranslationButton.module.css';

interface TranslationButtonProps {
  content: string;
  filePath: string;
}

export default function TranslationButton({ content, filePath }: TranslationButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);

  const translateToUrdu = async () => {
    setIsTranslating(true);

    try {
      const response = await fetch('http://localhost:8000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          target_language: 'ur',
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslatedContent(data.translated_content);
      setIsTranslated(true);
    } catch (error) {
      console.error('Error translating content:', error);
      alert('Failed to translate content. Please try again.');
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
              Show Original
            </>
          ) : (
            <>
              Translate to Urdu
            </>
          )}
        </button>
      </div>

      {isTranslated && translatedContent && (
        <div className={styles.translatedContent}>
          <div className={styles.contentHeader}>
            <span className={styles.badge}>
              Urdu Translation
            </span>
            <span className={styles.note}>
              AI-powered translation
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
