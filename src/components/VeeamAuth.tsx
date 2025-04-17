
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { initVeeamApi } from '@/services/veeamApi';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { BACKUP_JOBS_QUERY_KEY } from '@/hooks/useBackupJobs';

interface VeeamAuthProps {
  onAuthenticated: () => void;
}

export const VeeamAuth = ({ onAuthenticated }: VeeamAuthProps) => {
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!baseUrl || !username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Initialize the Veeam API service
      const veeamApi = initVeeamApi(baseUrl.trim());
      
      // Attempt to log in
      const success = await veeamApi.login(username, password);
      
      if (success) {
        // Store authentication state in localStorage
        localStorage.setItem('veeamApiUrl', baseUrl);
        localStorage.setItem('veeamAuthenticated', 'true');
        
        // Invalidate queries to fetch fresh data
        queryClient.invalidateQueries({ queryKey: [BACKUP_JOBS_QUERY_KEY] });
        
        toast.success('Successfully connected to Veeam B&R');
        onAuthenticated();
      } else {
        toast.error('Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect to Veeam API. Please check the server URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect to Veeam B&R</CardTitle>
        <CardDescription>Enter your Veeam Backup & Replication server details</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseUrl">Veeam API URL</Label>
            <Input
              id="baseUrl"
              placeholder="https://veeam-server:9419"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Administrator"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
