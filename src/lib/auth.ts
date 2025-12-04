/**
 * BetterAuth Configuration
 * Handles user authentication and session management
 */

import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL || '',
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disable for hackathon demo
  },
  user: {
    additionalFields: {
      programmingExperience: {
        type: 'string',
        required: false,
        defaultValue: 'beginner',
      },
      roboticsBackground: {
        type: 'string',
        required: false,
        defaultValue: 'none',
      },
      hardwareAccess: {
        type: 'string',
        required: false,
        defaultValue: 'basic_pc',
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
