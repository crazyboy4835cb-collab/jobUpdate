import { IJob } from '../types';

const ADMIN_TOKEN_KEY = 'jobupdate_admin_token';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  },
  removeToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },
  isAuthenticated(): boolean {
    return !!localStorage.getItem(ADMIN_TOKEN_KEY);
  },
};

export const api = {
  // Public API
  async getJobs(): Promise<IJob[]> {
    const res = await fetch('/api/jobs');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch jobs');
    return data.data;
  },

  async getJobById(id: string): Promise<IJob> {
    const res = await fetch(`/api/jobs/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch job details');
    return data.data;
  },

  async submitContact(formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ message: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit contact message');
    return data;
  },

  // Admin Auth API
  async adminLogin(username: string, password: string): Promise<{ token: string; username: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid credentials');
    authStorage.setToken(data.token);
    return { token: data.token, username: data.admin?.username || username };
  },

  async verifyAdmin(): Promise<boolean> {
    const token = authStorage.getToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        authStorage.removeToken();
        return false;
      }
      return res.ok;
    } catch {
      return false;
    }
  },

  async getAdminStats(): Promise<{
    totalJobs: number;
    activeJobs: number;
    closedJobs: number;
    dbStatus: string;
  }> {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) authStorage.removeToken();
      throw new Error(data.error || 'Failed to fetch stats');
    }
    return data.stats;
  },

  // Admin Job Operations (Protected /api/admin/jobs)
  async createJob(jobData: Partial<IJob>): Promise<IJob> {
    const token = authStorage.getToken();
    const res = await fetch('/api/admin/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) authStorage.removeToken();
      throw new Error(data.error || 'Failed to create job');
    }
    return data.data;
  },

  async updateJob(id: string, jobData: Partial<IJob>): Promise<IJob> {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) authStorage.removeToken();
      throw new Error(data.error || 'Failed to update job');
    }
    return data.data;
  },

  async deleteJob(id: string): Promise<void> {
    const token = authStorage.getToken();
    const res = await fetch(`/api/admin/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) authStorage.removeToken();
      throw new Error(data.error || 'Failed to delete job');
    }
  },
};
