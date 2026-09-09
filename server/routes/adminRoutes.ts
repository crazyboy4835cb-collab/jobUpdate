import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { JobDataService, AdminDataService, isMongoConnected } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'jobupdate-admin-secret-key-9872134';

/**
 * POST /api/admin/login
 * Backwards-compatible / alternate path for admin login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const rawUsername = req.body.username || req.body.email;
    const rawPassword = req.body.password;

    if (!rawUsername || !rawPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both administrator username/email and password.',
      });
    }

    const username = String(rawUsername).trim();
    const password = String(rawPassword);

    const admin = await AdminDataService.findByUsername(username);

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator credentials.',
      });
    }

    const isMatch = await AdminDataService.verifyPassword(password, admin.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid administrator credentials.',
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: 'admin',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      admin: {
        username: admin.username,
        role: 'admin',
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Authentication error: ' + error.message,
    });
  }
});

/**
 * GET /api/admin/me
 * Protected verification endpoint for admin JWT session
 */
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    admin: req.admin,
    database: {
      connected: isMongoConnected(),
      mode: isMongoConnected() ? 'MongoDB Cloud/Local' : 'Resilient Active Engine',
    },
  });
});

/**
 * GET /api/admin/stats
 * Protected statistics calculation
 */
router.get('/stats', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await JobDataService.getStats();
    res.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to compute admin statistics: ' + error.message,
    });
  }
});

/**
 * PROTECTED ADMIN JOB APIs
 * POST /api/admin/jobs
 * Requires a valid admin JWT. Rejects with 401/403 otherwise.
 */
router.post('/jobs', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      experience,
      salary,
      batch,
      companyAbout,
      roleOverview,
      eligibility,
      additionalInfo,
      applyUrl,
      status,
    } = req.body;

    if (
      !title ||
      !company ||
      !location ||
      !companyAbout ||
      !roleOverview ||
      !eligibility ||
      !applyUrl
    ) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all mandatory job information fields.',
      });
    }

    const newJob = await JobDataService.create({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      jobType: jobType || 'Full-time',
      experience: experience || 'Freshers Eligible',
      salary: salary || 'Best in Industry',
      batch: batch || 'All Batches',
      companyAbout: companyAbout.trim(),
      roleOverview: roleOverview.trim(),
      eligibility: eligibility.trim(),
      additionalInfo: additionalInfo ? additionalInfo.trim() : '• Standard selection process applies',
      applyUrl: applyUrl.trim(),
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Job posting published successfully.',
      data: newJob,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to create job post: ' + error.message,
    });
  }
});

/**
 * PUT /api/admin/jobs/:id
 * Requires a valid admin JWT. Rejects with 401/403 otherwise.
 */
router.put('/jobs/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await JobDataService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Job posting not found to update.',
      });
    }
    res.json({
      success: true,
      message: 'Job posting updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to update job post: ' + error.message,
    });
  }
});

/**
 * DELETE /api/admin/jobs/:id
 * Requires a valid admin JWT. Rejects with 401/403 otherwise.
 */
router.delete('/jobs/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = await JobDataService.delete(req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Job posting not found to delete.',
      });
    }
    res.json({
      success: true,
      message: 'Job posting removed successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete job post: ' + error.message,
    });
  }
});

export default router;
