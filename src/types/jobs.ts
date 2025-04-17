
export type JobStatus = "running" | "success" | "failed" | "queued" | "warning";

export interface Job {
  id: number;
  name: string;
  type: string;
  status: JobStatus;
  progress: number;
  startTime: string | null;
  estimatedCompletion: string | null;
  lastSuccessful: string;
}
