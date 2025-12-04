import React, { useState } from 'react';
import styles from './PersonalizationButton.module.css';

interface PersonalizationButtonProps {
  content: string;
  filePath: string;
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export default function PersonalizationButton({ content, filePath }: PersonalizationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const personalizeContent = async (level: SkillLevel) => {
    setIsLoading(true);
    setSelectedLevel(level);
    setShowDropdown(false);

    try {
      const response = await fetch('http://localhost:8000/api/personalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          chapter: filePath,
          user_level: level,
        }),
      });

      if (!response.ok) {
        throw new Error('Personalization failed');
      }

      const data = await response.json();
      setPersonalizedContent(data.personalized_content);
    } catch (error) {
      console.error('Error personalizing content:', error);
      alert('Failed to personalize content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetContent = () => {
    setPersonalizedContent(null);
    setSelectedLevel(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <button
          className={styles.mainButton}
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              Personalizing...
            </>
          ) : selectedLevel ? (
            <>
              {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Level
            </>
          ) : (
            <>
              Adaptive Learning
            </>
          )}
        </button>

        {selectedLevel && !isLoading && (
          <button className={styles.resetButton} onClick={resetContent} title="Reset to original">
            ↺
          </button>
        )}
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            Choose your skill level:
          </div>
          <button
            className={styles.dropdownItem}
            onClick={() => personalizeContent('beginner')}
          >
            <span className={styles.levelIcon}>🌱</span>
            <div>
              <strong>Beginner</strong>
              <p>New to robotics, need detailed explanations</p>
            </div>
          </button>
          <button
            className={styles.dropdownItem}
            onClick={() => personalizeContent('intermediate')}
          >
            <span className={styles.levelIcon}>🚀</span>
            <div>
              <strong>Intermediate</strong>
              <p>Some experience, want practical examples</p>
            </div>
          </button>
          <button
            className={styles.dropdownItem}
            onClick={() => personalizeContent('advanced')}
          >
            <span className={styles.levelIcon}>⚡</span>
            <div>
              <strong>Advanced</strong>
              <p>Expert level, focus on optimization</p>
            </div>
          </button>
        </div>
      )}

      {personalizedContent && (
        <div className={styles.personalizedContent}>
          <div className={styles.contentHeader}>
            <span className={styles.badge}>
              Personalized for {selectedLevel} level
            </span>
          </div>
          <div 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: personalizedContent }}
          />
        </div>
      )}
    </div>
  );
}
