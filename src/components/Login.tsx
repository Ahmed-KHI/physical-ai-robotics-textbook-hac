/**
 * Login Component
 * Handles user authentication with background questionnaire
 */

import React, { useState } from 'react';
import styles from './Login.module.css';

interface LoginProps {
  onSuccess: (email: string, name: string, token: string) => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    programmingExperience: 'beginner',
    roboticsBackground: 'none',
    hardwareAccess: 'basic_pc',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign up new user
        const response = await fetch('http://localhost:8000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            full_name: formData.name,
            programming_experience: formData.programmingExperience,
            robotics_background: formData.roboticsBackground,
            hardware_access: formData.hardwareAccess,
          }),
        });

        if (!response.ok) {
          throw new Error('Signup failed');
        }

        const data = await response.json();
        // Auto-login after signup
        onSuccess(formData.email, formData.name, 'new_user_token');
      } else {
        // Sign in existing user
        const response = await fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          throw new Error('Sign in failed');
        }

        const data = await response.json();
        
        // Determine user name (demo account or generic)
        const userName = formData.email === 'teacher@giaic.com' 
          ? 'GIAIC Teacher (Demo)' 
          : formData.email.split('@')[0];
        
        onSuccess(formData.email, userName, data.access_token);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        <p className={styles.subtitle}>
          {isSignUp
            ? 'Join the Physical AI learning community'
            : 'Sign in to personalize your learning experience'}
        </p>

        {!isSignUp && (
          <div className={styles.demoCredentials}>
            <div className={styles.demoHeader}>🔑 Demo Account for Teachers/Reviewers:</div>
            <div className={styles.demoInfo}>
              <strong>Email:</strong> teacher@giaic.com<br />
              <strong>Password:</strong> Teacher@123
            </div>
            <div className={styles.demoNote}>
              Use these credentials to review the project features
            </div>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignUp && (
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Your Full Name"
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
              minLength={8}
            />
          </div>

          {isSignUp && (
            <>
              <div className={styles.divider}>
                <span>Tell us about your background</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="programming">Programming Experience</label>
                <select
                  id="programming"
                  value={formData.programmingExperience}
                  onChange={(e) =>
                    setFormData({ ...formData, programmingExperience: e.target.value })
                  }
                >
                  <option value="beginner">Beginner - New to programming</option>
                  <option value="intermediate">Intermediate - Some experience</option>
                  <option value="advanced">Advanced - Professional developer</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="robotics">Robotics Background</label>
                <select
                  id="robotics"
                  value={formData.roboticsBackground}
                  onChange={(e) =>
                    setFormData({ ...formData, roboticsBackground: e.target.value })
                  }
                >
                  <option value="none">None - Complete beginner</option>
                  <option value="hobbyist">Hobbyist - Some tinkering</option>
                  <option value="professional">Professional - Industry experience</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="hardware">Hardware Access</label>
                <select
                  id="hardware"
                  value={formData.hardwareAccess}
                  onChange={(e) =>
                    setFormData({ ...formData, hardwareAccess: e.target.value })
                  }
                >
                  <option value="none">None - Just learning theory</option>
                  <option value="basic_pc">Basic PC - Standard laptop/desktop</option>
                  <option value="high_end_workstation">
                    High-end Workstation - RTX GPU
                  </option>
                  <option value="full_lab">Full Lab - Complete robotics setup</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className={styles.toggleMode}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className={styles.toggleButton}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
