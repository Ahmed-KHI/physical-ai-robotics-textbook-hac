/**
 * Auth Provider Component
 * Wraps the app with authentication context
 * Uses localStorage for simple session management
 */

import React, { useEffect, useState } from 'react';
import Login from './Login';
import styles from './AuthProvider.module.css';

interface User {
  email: string;
  name: string;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    const userEmail = localStorage.getItem('user_email');
    const userName = localStorage.getItem('user_name');

    if (token && userEmail && userName) {
      setUser({ email: userEmail, name: userName });
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (email: string, name: string, token: string) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_name', name);
    setUser({ email, name });
  };

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    setUser(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onSuccess={handleLoginSuccess} />;
  }

  const userInitial = user.name.charAt(0).toUpperCase();

  return (
    <div>
      <div className={styles.userBar}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{userInitial}</div>
          <div>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className={styles.signOutButton}
        >
          Sign Out
        </button>
      </div>
      {children}
    </div>
  );
}
