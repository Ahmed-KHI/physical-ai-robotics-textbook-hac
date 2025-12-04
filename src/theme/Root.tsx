/**
 * Root component wrapper
 * Adds global components like Chatbot to all pages
 * Wraps app with AuthProvider for authentication
 */

import React from 'react';
import Chatbot from '@site/src/components/Chatbot';
import AuthProvider from '@site/src/components/AuthProvider';

export default function Root({children}) {
  return (
    <AuthProvider>
      {children}
      <Chatbot />
    </AuthProvider>
  );
}
