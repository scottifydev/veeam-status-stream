
import axios, { AxiosInstance } from 'axios';
import { Job, JobStatus } from '@/types/jobs';

// Extending Job type to include Veeam-specific fields
interface VeeamJob extends Omit<Job, 'status'> {
  veeamId: string;
  veeamStatus: string;
  repository: string;
  lastRun?: {
    endTime: string;
    result: string;
  };
}

class VeeamApiService {
  private api: AxiosInstance;
  private authToken: string | null = null;
  private refreshToken: string | null = null;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.api = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry && this.refreshToken) {
          originalRequest._retry = true;
          await this.refreshAuthToken();
          originalRequest.headers['Authorization'] = `Bearer ${this.authToken}`;
          return this.api(originalRequest);
        }
        return Promise.reject(error);
      }
    );
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await this.api.post('/api/oauth2/token', {
        grant_type: 'password',
        username,
        password,
      });

      if (response.data.access_token) {
        this.authToken = response.data.access_token;
        this.refreshToken = response.data.refresh_token;
        
        // Set the token in the API instance
        this.api.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Veeam login failed:', error);
      return false;
    }
  }

  private async refreshAuthToken(): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/oauth2/token`, {
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
      });

      if (response.data.access_token) {
        this.authToken = response.data.access_token;
        this.refreshToken = response.data.refresh_token;
        this.api.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }

  async getBackupJobs(): Promise<Job[]> {
    try {
      const response = await this.api.get('/api/v1/jobs');
      
      // Map Veeam jobs to our application's Job interface
      return response.data.data.map((job: VeeamJob) => this.mapVeeamJob(job));
    } catch (error) {
      console.error('Failed to fetch backup jobs:', error);
      throw error;
    }
  }

  async getBackupJobById(jobId: string): Promise<Job | null> {
    try {
      const response = await this.api.get(`/api/v1/jobs/${jobId}`);
      return this.mapVeeamJob(response.data);
    } catch (error) {
      console.error(`Failed to fetch job ${jobId}:`, error);
      return null;
    }
  }

  async getBackupJobSessions(jobId: string, limit = 5): Promise<any[]> {
    try {
      const response = await this.api.get(`/api/v1/jobs/${jobId}/includes/jobSessions?limit=${limit}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Failed to fetch job sessions for ${jobId}:`, error);
      return [];
    }
  }

  private mapVeeamJob(veeamJob: VeeamJob): Job {
    // Map Veeam status to our application status
    const status = this.mapVeeamStatus(veeamJob.veeamStatus);
    
    // Calculate progress based on Veeam job info
    // This is an example - actual implementation depends on what data Veeam provides
    const progress = status === 'running' ? this.calculateProgress(veeamJob) : 100;
    
    return {
      id: parseInt(veeamJob.veeamId, 10) || Math.floor(Math.random() * 10000),
      name: veeamJob.name,
      type: `Backup - ${veeamJob.repository || 'Default Repository'}`,
      status,
      progress,
      startTime: status === 'running' ? new Date().toISOString() : null,
      estimatedCompletion: status === 'running' ? this.calculateEstimatedCompletion(veeamJob) : null,
      lastSuccessful: veeamJob.lastRun?.result === 'Success' ? 
        veeamJob.lastRun.endTime : 
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Fallback to 24h ago
    };
  }

  private mapVeeamStatus(veeamStatus: string): JobStatus {
    // Map Veeam statuses to our application statuses
    switch (veeamStatus.toLowerCase()) {
      case 'running':
        return 'running';
      case 'success':
      case 'completed':
        return 'success';
      case 'failed':
      case 'error':
        return 'failed';
      case 'warning':
        return 'warning';
      case 'idle':
      case 'pending':
      default:
        return 'queued';
    }
  }

  private calculateProgress(job: VeeamJob): number {
    // This is a placeholder - implementation depends on Veeam API
    // In a real implementation, you would use data from the job
    // such as processed bytes vs total bytes, or elapsed time vs estimated time
    return Math.floor(Math.random() * 90) + 10; // Random progress between 10-99% for demo
  }

  private calculateEstimatedCompletion(job: VeeamJob): string | null {
    // This is a placeholder - implementation depends on Veeam API
    // Normally you would calculate based on current progress and average job duration
    const estimatedMinutesRemaining = Math.floor(Math.random() * 30) + 5;
    const completionTime = new Date();
    completionTime.setMinutes(completionTime.getMinutes() + estimatedMinutesRemaining);
    return completionTime.toISOString();
  }
}

// Create and export a singleton instance
let veeamApiService: VeeamApiService | null = null;

export const initVeeamApi = (baseUrl: string): VeeamApiService => {
  veeamApiService = new VeeamApiService(baseUrl);
  return veeamApiService;
};

export const getVeeamApi = (): VeeamApiService => {
  if (!veeamApiService) {
    throw new Error('Veeam API not initialized. Call initVeeamApi first.');
  }
  return veeamApiService;
};

export default VeeamApiService;
