import { Router, Request, Response } from 'express';
import { JobDataService } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public: Get all active jobs (newest first)
router.get('/', async (req: Request, res: Response) => {
  try {
    const jobs = await JobDataService.getAll();
    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve jobs: ' + error.message,
    });
  }
});

// Public: Get single job details by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const job = await JobDataService.getById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job posting not found or has been removed.',
      });
    }
    res.json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job details: ' + error.message,
    });
  }
});

// Admin Only: Create new job posting
router.post('/', authMiddleware, async (req: Request, res: Response) => {
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

// Admin Only: Update existing job posting
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
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

// Admin Only: Delete job posting
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
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
