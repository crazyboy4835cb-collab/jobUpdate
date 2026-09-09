import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { JobModel } from './models/Job';
import { AdminModel } from './models/Admin';

let isConnected = false;
let isConnecting = false;

// Initial verified sample job updates for immediate viewing
export const initialJobs = [
  {
    _id: '65f000000000000000000001',
    title: 'Associate Software Engineer - 2025/2026 Batch',
    company: 'TechCorp Solutions',
    location: 'Bangalore / Remote',
    jobType: 'Full-time',
    experience: '0 - 1 Years (Freshers Welcome)',
    salary: '₹6.5 - ₹8.5 LPA',
    batch: '2024 / 2025 / 2026',
    companyAbout:
      'TechCorp Solutions is a leading enterprise cloud innovation and digital transformation firm serving Global 2000 clients across 18 countries.',
    roleOverview:
      'As an Associate Software Engineer, you will contribute directly to product architecture, modern API development, and customer-facing web services. You will collaborate with senior architects in an agile engineering culture.',
    eligibility:
      '• B.E / B.Tech / M.Tech / MCA in Computer Science, IT or related branches\n• Minimum 60% or 6.5 CGPA throughout academic career (10th, 12th & Graduation)\n• Solid understanding of Data Structures, Algorithms, and Object-Oriented Programming\n• Hands-on familiarity with JavaScript, TypeScript, Python, or Java\n• Good analytical and verbal communication skills',
    additionalInfo:
      '• Selection Process: Online Aptitude & Coding Assessment -> Technical Interview -> HR Discussion\n• Work Mode: Hybrid (2 days in-office, 3 days remote)\n• Benefits: Comprehensive Health Insurance, Learning Allowance, Mentorship Programs\n• Application Deadline: Rolling Basis (Apply as soon as possible)',
    applyUrl: 'https://careers.google.com',
    status: 'active' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    _id: '65f000000000000000000002',
    title: 'Graduate Trainee - Data Analyst',
    company: 'Nexus Financial Analytics',
    location: 'Hyderabad / Pune',
    jobType: 'Full-time',
    experience: '0 - 2 Years',
    salary: '₹5.5 - ₹7.0 LPA',
    batch: '2023 / 2024 / 2025',
    companyAbout:
      'Nexus Financial Analytics empowers international banking institutions with predictive algorithmic analytics, risk forecasting, and real-time transaction processing intelligence.',
    roleOverview:
      'The Graduate Trainee Analyst will assist data engineering teams in building business intelligence dashboards, validating transactional data streams, and developing automated reporting scripts using SQL and Python.',
    eligibility:
      '• Degree in Computer Science, Statistics, Mathematics, Economics, or Data Engineering\n• Proficiency in SQL queries, joins, and relational database schema design\n• Familiarity with Python (Pandas, NumPy) or Power BI / Tableau\n• Strong numerical reasoning and problem-solving aptitude',
    additionalInfo:
      '• Selection Process: Domain Test -> Case Study Round -> Managerial Interview\n• Work Mode: On-site at Tech Park\n• Shift: General Day Shift (9:30 AM - 6:30 PM)\n• Fast-track promotion appraisal after 12 months',
    applyUrl: 'https://www.linkedin.com/jobs',
    status: 'active' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
  },
  {
    _id: '65f000000000000000000003',
    title: 'Junior Frontend Developer (React & Tailwind)',
    company: 'PixelWave Studios',
    location: 'Gurugram / Work From Home',
    jobType: 'Full-time / Internship',
    experience: 'Freshers & Entry Level',
    salary: '₹4.8 - ₹6.5 LPA',
    batch: 'All Batches Eligible',
    companyAbout:
      'PixelWave Studios builds high-impact consumer web platforms and interactive SaaS tools for modern startups across North America and Europe.',
    roleOverview:
      'You will be implementing responsive UI components, optimizing page loading performance, and connecting user-facing web applications to backend REST APIs.',
    eligibility:
      '• Any graduate with proven frontend web development experience (projects/internships)\n• Strong command over HTML5, CSS3, JavaScript (ES6+), and React.js\n• Experience with Tailwind CSS or modern CSS layout practices\n• Knowledge of Git, GitHub, and browser developer tools',
    additionalInfo:
      '• Selection Process: Portfolio/GitHub Review -> Live Coding Round -> Culture Fit Interview\n• Perks: Flexible work hours, home-office equipment stipend\n• Joining: Immediate to 15 Days',
    applyUrl: 'https://github.com/about/careers',
    status: 'active' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
  },
  {
    _id: '65f000000000000000000004',
    title: 'Cloud Support & DevOps Intern',
    company: 'Apex Cloud Infrastructure',
    location: 'Mumbai / Remote',
    jobType: 'Internship (6 Months PPO)',
    experience: 'Freshers (0 Years)',
    salary: '₹25,000 / month Stipend (PPO: ₹7.5 LPA)',
    batch: '2025 / 2026 Batch',
    companyAbout:
      'Apex Cloud is an authorized cloud solutions integrator specializing in Kubernetes orchestration, CI/CD pipeline automation, and multi-region infrastructure management.',
    roleOverview:
      'Collaborate with the cloud infrastructure team to manage Linux virtual servers, monitor uptime alerts, write shell automation scripts, and assist in containerizing services.',
    eligibility:
      '• Students in final or pre-final year of B.E / B.Tech / B.Sc (IT/CS) / BCA\n• Basic understanding of Linux commands, file systems, and bash scripting\n• Conceptual knowledge of Docker, AWS, or Google Cloud\n• Curiosity to learn site reliability engineering principles',
    additionalInfo:
      '• Selection Process: Technical MCQ -> Technical Interview\n• High conversion rate to full-time Associate DevOps Engineer\n• Mentorship provided by certified cloud architects',
    applyUrl: 'https://aws.amazon.com/careers',
    status: 'active' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
];

// Synchronously initialize fallback admin with bcrypt password hashing at module load
const defaultAdminUsername = (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || 'admin')
  .trim()
  .toLowerCase();
const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'admin_secret_password';
const defaultSalt = bcrypt.genSaltSync(10);
const defaultHash = bcrypt.hashSync(defaultAdminPassword, defaultSalt);

// Fallback in-memory admin store containing only username and passwordHash (never plain text)
let memoryAdmin: { _id?: string; username: string; passwordHash: string } = {
  _id: 'admin_root_001',
  username: defaultAdminUsername,
  passwordHash: defaultHash,
};

// Fallback in-memory database store if external MongoDB cluster is not reachable
let memoryJobs = [...initialJobs];

export async function connectDB(): Promise<boolean> {
  if (isConnected) return true;
  if (isConnecting) return false;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobupdate';

  try {
    isConnecting = true;
    console.log(`[MongoDB] Attempting connection to MongoDB...`);
    
    // Set 2 second server selection timeout so fallback is instant if no local mongod
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });

    isConnected = true;
    isConnecting = false;
    console.log(`[MongoDB] Connected successfully to MongoDB!`);

    // Seed initial jobs if collection is empty
    const count = await JobModel.countDocuments();
    if (count === 0) {
      console.log(`[MongoDB] Seeding initial jobs...`);
      await JobModel.insertMany(initialJobs as any);
      console.log(`[MongoDB] Seeded ${initialJobs.length} jobs successfully.`);
    }

    // Seed initial admin account with bcrypt hashed password if collection is empty
    await initAdmin();

    return true;
  } catch (error: any) {
    isConnecting = false;
    isConnected = false;
    console.warn(`[MongoDB] Could not connect to external MongoDB server (${error.message}).`);
    console.log(`[MongoDB] Operating with resilient in-memory database fallback with ${memoryJobs.length} jobs preloaded.`);
    console.log(`[MongoDB] Set MONGODB_URI in your environment or Settings when you want to connect to a live MongoDB Atlas cluster.`);
    return false;
  }
}

async function initAdmin() {
  const initialUsername = (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || 'admin')
    .trim()
    .toLowerCase();
  const initialPassword = process.env.ADMIN_PASSWORD || 'admin_secret_password';

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(initialPassword, salt);

    memoryAdmin = {
      _id: 'admin_root_001',
      username: initialUsername,
      passwordHash,
    };

    if (isMongoConnected()) {
      const existingAdmin = await AdminModel.findOne({ username: initialUsername });
      if (!existingAdmin) {
        console.log(`[MongoDB] Seeding initial administrator account (${initialUsername})...`);
        await AdminModel.create({
          username: initialUsername,
          passwordHash,
        });
        console.log(`[MongoDB] Administrator account created successfully with bcrypt password hashing.`);
      }
    }
  } catch (err: any) {
    console.error('[Admin] Error initializing administrator credentials:', err.message);
  }
}

export function isMongoConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

// Database helper operations supporting both connected Mongoose and fallback memory store
export const JobDataService = {
  async getAll(): Promise<any[]> {
    if (isMongoConnected()) {
      try {
        return await JobModel.find().sort({ createdAt: -1 }).lean();
      } catch (e) {
        console.error('Mongoose query failed, using memory store fallback:', e);
      }
    }
    return [...memoryJobs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getById(id: string): Promise<any | null> {
    if (isMongoConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const job = await JobModel.findById(id).lean();
          if (job) return job;
        }
        const job = await JobModel.findOne({ _id: id }).lean();
        if (job) return job;
      } catch (e) {
        // ID might be formatted differently or query failed
      }
    }
    return (
      memoryJobs.find(
        (j) => String(j._id) === String(id) || String((j as any).id) === String(id)
      ) || null
    );
  },

  async create(data: any): Promise<any> {
    if (isMongoConnected()) {
      try {
        const newJob = await JobModel.create(data);
        return newJob.toObject();
      } catch (e) {
        console.error('Mongoose create failed, falling back to memory store:', e);
      }
    }
    const newJob = {
      ...data,
      _id: 'job_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: data.status || 'active',
    };
    memoryJobs.unshift(newJob);
    return newJob;
  },

  async update(id: string, data: any): Promise<any | null> {
    if (isMongoConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const updated = await JobModel.findByIdAndUpdate(id, data, { new: true }).lean();
          if (updated) return updated;
        } else {
          const updated = await JobModel.findOneAndUpdate({ _id: id }, data, { new: true }).lean();
          if (updated) return updated;
        }
      } catch (e) {
        console.error('Mongoose update failed:', e);
      }
    }
    const index = memoryJobs.findIndex(
      (j) => String(j._id) === String(id) || String((j as any).id) === String(id)
    );
    if (index !== -1) {
      memoryJobs[index] = {
        ...memoryJobs[index],
        ...data,
        updatedAt: new Date(),
      };
      return memoryJobs[index];
    }
    return null;
  },

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          const res = await JobModel.findByIdAndDelete(id);
          if (res) return true;
        } else {
          const res = await JobModel.findOneAndDelete({ _id: id });
          if (res) return true;
        }
      } catch (e) {
        console.error('Mongoose delete failed:', e);
      }
    }
    const initialLen = memoryJobs.length;
    memoryJobs = memoryJobs.filter(
      (j) => String(j._id) !== String(id) && String((j as any).id) !== String(id)
    );
    return memoryJobs.length < initialLen;
  },

  async getStats() {
    const all = await this.getAll();
    const active = all.filter((j) => j.status === 'active').length;
    return {
      totalJobs: all.length,
      activeJobs: active,
      closedJobs: all.length - active,
      dbStatus: isMongoConnected() ? 'MongoDB Connected' : 'Ready (Standalone Mode)',
    };
  },
};

export const AdminDataService = {
  async findByUsername(username: string): Promise<{ _id?: string; username: string; passwordHash: string } | null> {
    const normalized = username.trim().toLowerCase();
    const configuredEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const configuredUser = (process.env.ADMIN_USERNAME || '').trim().toLowerCase();

    if (isMongoConnected()) {
      try {
        const queryConditions: any[] = [{ username: normalized }];
        if (configuredEmail) queryConditions.push({ username: configuredEmail });
        if (configuredUser) queryConditions.push({ username: configuredUser });

        const adminDoc = await AdminModel.findOne({ $or: queryConditions }).lean();
        if (adminDoc) {
          return {
            _id: (adminDoc as any)._id?.toString(),
            username: (adminDoc as any).username,
            passwordHash: (adminDoc as any).passwordHash,
          };
        }
      } catch (err: any) {
        console.error('[Admin] Query error on MongoDB:', err.message);
      }
    }

    // Check in-memory fallback
    if (memoryAdmin) {
      const allowedIdentifiers = [
        memoryAdmin.username.toLowerCase(),
        'admin',
        'admin@jobupdate.com',
        configuredUser,
        configuredEmail,
        configuredEmail ? configuredEmail.split('@')[0] : '',
      ].filter(Boolean);

      if (allowedIdentifiers.includes(normalized)) {
        return memoryAdmin;
      }
    }

    return null;
  },

  async verifyPassword(candidatePassword: string, passwordHash: string): Promise<boolean> {
    if (!candidatePassword || !passwordHash) return false;
    return bcrypt.compare(candidatePassword, passwordHash);
  },
};
