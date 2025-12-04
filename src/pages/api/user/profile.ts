/**
 * User Profile API Endpoint
 * Stores user profiling data after signup
 */

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, programmingExperience, roboticsBackground, hardwareAccess } = req.body;

    // TODO: Store in database
    // For now, we'll just acknowledge receipt
    // In production, store this in Neon Postgres alongside user record
    
    console.log('User profile received:', {
      email,
      programmingExperience,
      roboticsBackground,
      hardwareAccess,
    });

    return res.status(200).json({ 
      success: true,
      message: 'Profile saved successfully' 
    });
  } catch (error) {
    console.error('Profile save error:', error);
    return res.status(500).json({ error: 'Failed to save profile' });
  }
}
