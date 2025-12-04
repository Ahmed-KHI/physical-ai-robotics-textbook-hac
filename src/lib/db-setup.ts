/**
 * Database Schema Setup for BetterAuth
 * Creates necessary tables for authentication and user profiles
 */

import { sql } from '@vercel/postgres';
import { auth } from './auth';

export async function setupDatabase() {
  try {
    // BetterAuth will automatically create tables
    // This script ensures the database is ready
    
    console.log('Setting up database schema...');
    
    // Create additional tables if needed
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        programming_experience TEXT DEFAULT 'beginner',
        robotics_background TEXT DEFAULT 'none',
        hardware_access TEXT DEFAULT 'basic_pc',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    console.log('✓ Database schema ready');
    return true;
  } catch (error) {
    console.error('Database setup error:', error);
    return false;
  }
}
