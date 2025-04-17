
interface ProgressBarProps {
  progress: number;
  status: "running" | "success" | "failed" | "queued" | "warning";
}

export const ProgressBar = ({ progress, status }: ProgressBarProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-emerald-500";
      case "failed":
        return "bg-red-500";
      case "warning":
        return "bg-amber-500";
      case "running":
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${getStatusColor(status)} transition-all duration-500 ease-in-out ${
          status === "running" ? "animate-pulse" : ""
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
