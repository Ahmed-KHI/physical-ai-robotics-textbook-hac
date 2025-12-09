import React from 'react';
import styles from './SpecKitBadge.module.css';

export default function SpecKitBadge(): JSX.Element {
  return (
    <div className={styles.specKitBadge}>
      <a
        href="https://github.com/github/spec-kit"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.badgeLink}
        title="Built with Spec-Kit - Spec-Driven Development"
      >
        <svg
          className={styles.badgeIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="currentColor"
            opacity="0.5"
          />
          <path
            d="M2 17L12 22L22 17V12L12 17L2 12V17Z"
            fill="currentColor"
          />
        </svg>
        <span className={styles.badgeText}>Built with Spec-Kit</span>
      </a>
    </div>
  );
}
