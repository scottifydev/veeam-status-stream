
import { type Job } from '@/types/jobs';

export const mockJobs: Job[] = [
  {
    id: 1,
    name: "Daily Full Backup - DB Server",
    type: "Full Backup",
    status: "running",
    progress: 45,
    startTime: "2025-04-17T08:00:00Z",
    estimatedCompletion: "2025-04-17T09:30:00Z",
    lastSuccessful: "2025-04-16T08:00:00Z"
  },
  {
    id: 2,
    name: "Weekly Archive - File Shares",
    type: "Archive",
    status: "success",
    progress: 100,
    startTime: "2025-04-17T06:00:00Z",
    estimatedCompletion: "2025-04-17T07:00:00Z",
    lastSuccessful: "2025-04-10T06:00:00Z"
  },
  {
    id: 3,
    name: "Incremental Backup - Web Servers",
    type: "Incremental",
    status: "failed",
    progress: 67,
    startTime: "2025-04-17T07:30:00Z",
    estimatedCompletion: "2025-04-17T08:00:00Z",
    lastSuccessful: "2025-04-16T07:30:00Z"
  },
  {
    id: 4,
    name: "Replica Sync - DR Site",
    type: "Replication",
    status: "queued",
    progress: 0,
    startTime: null,
    estimatedCompletion: null,
    lastSuccessful: "2025-04-16T10:00:00Z"
  }
];
