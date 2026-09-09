import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AdminDataService } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'jobupdate-admin-secret-key-9872134';

/**
 * ADMIN LOGIN API:
 * POST /api/auth/login
 * 1. Receive username and password.
 * 2. Find the admin.
 * 3. Compare password using bcrypt.
 * 4. Generate JWT if credentials are correct.
 * 5. Return the token securely.
 * 6. Reject incorrect credentials.
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const rawUsername = req.body.username || req.body.email;
    const rawPassword = req.body.password;

    if (!rawUsername || !rawPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both username and password.',
      });
    }

    const username = String(rawUsername).trim();
    const password = String(rawPassword);

    // 1 & 2. Find the admin in database
    const admin = await AdminDataService.findByUsername(username);

    if (!admin) {
      // Reject incorrect credentials
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator credentials.',
      });
    }

    // 3. Compare password using bcrypt
    const isMatch = await AdminDataService.verifyPassword(password, admin.passwordHash);

    if (!isMatch) {
      // Reject incorrect credentials
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator credentials.',
      });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: 'admin',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Return token securely
    return res.json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      admin: {
        username: admin.username,
        role: 'admin',
      },
    });
  } catch (err: any) {
    console.error('[Auth] Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal authentication error: ' + err.message,
    });
  }
});

export default router;
