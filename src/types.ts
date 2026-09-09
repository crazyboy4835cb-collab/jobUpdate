export interface IJob {
  _id?: string;
  id?: string;
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
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AdminUser {
  email: string;
  role: 'admin';
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
