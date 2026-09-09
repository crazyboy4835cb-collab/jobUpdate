import { Router, Request, Response } from 'express';

const router = Router();

// In-memory array of contact inquiries
const contactSubmissions: Array<{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: Date;
}> = [];

// POST /api/contact
router.post('/', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please fill out all contact form fields before submitting.',
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid email address.',
    });
  }

  const submission = {
    id: 'msg_' + Date.now(),
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    receivedAt: new Date(),
  };

  contactSubmissions.unshift(submission);
  console.log(`[Contact] New inquiry received from ${submission.name} (${submission.email}): ${submission.subject}`);

  return res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! Your message has been received and our team will respond shortly.',
    submissionId: submission.id,
  });
});

export default router;
