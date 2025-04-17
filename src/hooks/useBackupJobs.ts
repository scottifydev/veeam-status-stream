
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Job } from '@/types/jobs';
import { getVeeamApi } from '@/services/veeamApi';
import { useEffect } from 'react';

// Key for backup jobs query
export const BACKUP_JOBS_QUERY_KEY = 'backup-jobs';

export const useBackupJobs = (pollingInterval = 10000) => {
  const queryClient = useQueryClient();

  // Set up polling for real-time updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: [BACKUP_JOBS_QUERY_KEY] });
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [queryClient, pollingInterval]);

  return useQuery({
    queryKey: [BACKUP_JOBS_QUERY_KEY],
    queryFn: async (): Promise<Job[]> => {
      const veeamApi = getVeeamApi();
      return veeamApi.getBackupJobs();
    },
    staleTime: pollingInterval - 1000,
    refetchOnWindowFocus: true,
    retry: 3,
  });
};

export const useBackupJob = (jobId: string | number) => {
  return useQuery({
    queryKey: [BACKUP_JOBS_QUERY_KEY, jobId],
    queryFn: async (): Promise<Job | null> => {
      const veeamApi = getVeeamApi();
      return veeamApi.getBackupJobById(String(jobId));
    },
    enabled: !!jobId,
    staleTime: 5000,
  });
};
