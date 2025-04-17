
import { mockJobs } from "@/lib/mockData";
import { BackupJobCard } from "@/components/BackupJobCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Backup Jobs Dashboard</h1>
          <p className="text-muted-foreground">Monitor your backup operations in real-time</p>
        </div>
        
        <div className="space-y-4">
          {mockJobs.map((job) => (
            <BackupJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
