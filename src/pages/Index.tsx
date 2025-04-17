
import { mockJobs } from "@/lib/mockData";
import { BackupJobCard } from "@/components/BackupJobCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Backup Jobs Dashboard</h1>
          <p className="text-gray-600">Monitor your backup operations in real-time</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockJobs.map((job) => (
            <BackupJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
