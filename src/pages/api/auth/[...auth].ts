/**
 * BetterAuth API Route Handler
 * Handles all authentication endpoints: /api/auth/*
 */

import { auth } from '@site/src/lib/auth';

export default async function handler(req, res) {
  return auth.handler(req, res);
}
