
import { CheckCircle, AlertCircle, AlertTriangle, Clock, Activity } from "lucide-react";
import { type JobStatus } from "@/types/jobs";

interface StatusIndicatorProps {
  status: JobStatus;
  className?: string;
}

export const StatusIndicator = ({ status, className = "" }: StatusIndicatorProps) => {
  const getStatusConfig = (status: JobStatus) => {
    switch (status) {
      case "success":
        return {
          color: "text-emerald-500",
          icon: CheckCircle,
          label: "Completed"
        };
      case "failed":
        return {
          color: "text-red-500",
          icon: AlertCircle,
          label: "Failed"
        };
      case "warning":
        return {
          color: "text-amber-500",
          icon: AlertTriangle,
          label: "Warning"
        };
      case "queued":
        return {
          color: "text-muted-foreground",
          icon: Clock,
          label: "Queued"
        };
      case "running":
        return {
          color: "text-primary",
          icon: Activity,
          label: "Running"
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 ${config.color} ${className}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
};
