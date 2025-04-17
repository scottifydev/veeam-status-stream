
import { useState, useEffect } from "react";
import { BackupJobCard } from "@/components/BackupJobCard";
import { VeeamAuth } from "@/components/VeeamAuth";
import { useBackupJobs } from "@/hooks/useBackupJobs";
import { initVeeamApi } from "@/services/veeamApi";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check if already authenticated
  useEffect(() => {
    const apiUrl = localStorage.getItem('veeamApiUrl');
    const authenticated = localStorage.getItem('veeamAuthenticated') === 'true';
    
    if (apiUrl && authenticated) {
      // Initialize the API with the stored URL
      initVeeamApi(apiUrl);
      setIsAuthenticated(true);
    }
  }, []);
  
  // Fetch backup jobs using our custom hook
  const { data: backupJobs, isLoading, error } = useBackupJobs();
  
  // Handle authentication success
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };
  
  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Veeam Dashboard</h1>
            <p className="text-muted-foreground">Connect to your Veeam Backup & Replication server</p>
          </div>
          
          <VeeamAuth onAuthenticated={handleAuthenticated} />
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Backup Jobs Dashboard</h1>
            <p className="text-muted-foreground">Loading backup jobs...</p>
          </div>
          
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Backup Jobs Dashboard</h1>
            <p className="text-muted-foreground text-red-500">Error loading backup jobs</p>
          </div>
          
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            <p>Failed to load backup jobs. Please check your connection to the Veeam server.</p>
            <button 
              className="mt-4 px-4 py-2 bg-red-500/20 rounded hover:bg-red-500/30 transition-colors"
              onClick={() => {
                localStorage.removeItem('veeamAuthenticated');
                setIsAuthenticated(false);
              }}
            >
              Reconnect
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Backup Jobs Dashboard</h1>
            <p className="text-muted-foreground">Monitor your backup operations in real-time</p>
          </div>
          <button 
            className="px-3 py-1 text-sm bg-muted rounded hover:bg-muted/80 transition-colors"
            onClick={() => {
              localStorage.removeItem('veeamAuthenticated');
              setIsAuthenticated(false);
            }}
          >
            Change Server
          </button>
        </div>
        
        <div className="space-y-4">
          {backupJobs && backupJobs.length > 0 ? (
            backupJobs.map((job) => (
              <BackupJobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="p-6 bg-muted rounded-lg text-center">
              <p className="text-muted-foreground">No backup jobs found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
