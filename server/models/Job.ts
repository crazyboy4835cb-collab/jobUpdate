import mongoose, { Schema, Document } from 'mongoose';

export interface IJobDocument extends Document {
  title: string;
  company: string;
  location: string;
  jobType: string;
  experience: string;
  salary: string;
  batch: string;
  companyAbout: string;
  roleOverview: string;
  eligibility: string;
  additionalInfo: string;
  applyUrl: string;
  status: 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    jobType: { type: String, required: true, default: 'Full-time' },
    experience: { type: String, required: true, default: 'Freshers Eligible' },
    salary: { type: String, required: true, default: 'Not Disclosed' },
    batch: { type: String, required: true, default: 'Any Batch' },
    companyAbout: { type: String, required: true },
    roleOverview: { type: String, required: true },
    eligibility: { type: String, required: true },
    additionalInfo: { type: String, required: true },
    applyUrl: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

// Reuse existing model if already compiled (for HMR / tsx reload safety)
export const JobModel: mongoose.Model<IJobDocument> =
  (mongoose.models.Job as mongoose.Model<IJobDocument>) ||
  mongoose.model<IJobDocument>('Job', JobSchema);
