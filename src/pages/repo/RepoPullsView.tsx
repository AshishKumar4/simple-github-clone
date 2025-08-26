import { useOutletContext, Link, useParams } from 'react-router-dom';
import { Repository } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GitPullRequest, CheckCircle2, GitMerge } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
export function RepoPullsView() {
  const { repo } = useOutletContext<{ repo: Repository }>();
  const { user, repo: repoName } = useParams();
  const openPRs = repo.pullRequests.filter(pr => pr.state === 'open');
  const closedPRs = repo.pullRequests.filter(pr => pr.state === 'closed' || pr.state === 'merged');
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input placeholder="Filter pull requests" className="w-64" />
        </div>
        <Button>New pull request</Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <div className="p-3 bg-muted/50 border-b text-sm font-medium flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <GitPullRequest className="h-4 w-4" />
              <span>{openPRs.length} Open</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span>{closedPRs.length} Closed</span>
            </div>
          </div>
          <div>
            {repo.pullRequests.map(pr => (
              <div key={pr.id} className="flex items-start space-x-4 p-3 border-b last:border-b-0">
                {pr.state === 'open' && <GitPullRequest className="h-5 w-5 text-green-600 mt-1" />}
                {pr.state === 'closed' && <GitPullRequest className="h-5 w-5 text-red-600 mt-1" />}
                {pr.state === 'merged' && <GitMerge className="h-5 w-5 text-purple-600 mt-1" />}
                <div className="flex-1">
                  <Link to={`/${user}/${repoName}/pulls/${pr.number}`} className="font-semibold hover:text-blue-500 pr-2">
                    {pr.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">
                    #{pr.number} opened {formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })} by {pr.user.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}