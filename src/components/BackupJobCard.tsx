
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "./ProgressBar";
import { StatusIndicator } from "./StatusIndicator";
import { type Job } from "@/types/jobs";
import { formatDistanceToNow, format } from "date-fns";

interface BackupJobCardProps {
  job: Job;
}

export const BackupJobCard = ({ job }: BackupJobCardProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "HH:mm:ss");
  };

  const getLastSuccessfulText = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job.name}</h3>
            <p className="text-sm text-gray-500">{job.type}</p>
          </div>
          <StatusIndicator status={job.status} />
        </div>

        <ProgressBar progress={job.progress} status={job.status} />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Start Time</p>
            <p className="font-mono">{formatDate(job.startTime)}</p>
          </div>
          <div>
            <p className="text-gray-500">Est. Completion</p>
            <p className="font-mono">{formatDate(job.estimatedCompletion)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Last successful: {getLastSuccessfulText(job.lastSuccessful)}</span>
        </div>
      </div>
    </Card>
  );
};
