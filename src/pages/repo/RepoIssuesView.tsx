import { useOutletContext, Link, useParams } from 'react-router-dom';
import { Repository, Issue } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, MessageSquare, User, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export function RepoIssuesView() {
  const { repo } = useOutletContext<{ repo: Repository }>();
  const { user, repo: repoName } = useParams();
  const openIssues = repo.issues.filter(i => i.state === 'open');
  const closedIssues = repo.issues.filter(i => i.state === 'closed');
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input placeholder="Filter issues" className="w-64" />
          <Button variant="outline">Labels</Button>
          <Button variant="outline">Milestones</Button>
        </div>
        <Button>New issue</Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <div className="p-3 bg-muted/50 border-b text-sm font-medium flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{openIssues.length} Open</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span>{closedIssues.length} Closed</span>
            </div>
          </div>
          <div>
            {repo.issues.map(issue => (
              <div key={issue.id} className="flex items-start space-x-4 p-3 border-b last:border-b-0">
                {issue.state === 'open' ? (
                  <AlertCircle className="h-5 w-5 text-green-600 mt-1" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mt-1" />
                )}
                <div className="flex-1">
                  <Link to={`/${user}/${repoName}/issues/${issue.number}`} className="font-semibold hover:text-blue-500 pr-2">
                    {issue.title}
                  </Link>
                  {issue.labels.map(label => (
                    <Badge key={label.id} variant="outline" style={{ borderColor: `#${label.color}`, color: `#${label.color}` }} className="mr-1">
                      {label.name}
                    </Badge>
                  ))}
                  <p className="text-xs text-muted-foreground mt-1">
                    #{issue.number} opened {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })} by {issue.user.username}
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <TooltipProvider>
                    <div className="flex items-center -space-x-2">
                      {issue.assignees.map(assignee => (
                        <Tooltip key={assignee.id}>
                          <TooltipTrigger>
                            <Avatar className="h-5 w-5 border-2 border-background">
                              <AvatarImage src={assignee.avatarUrl} />
                              <AvatarFallback>{assignee.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>Assigned to {assignee.username}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                  {issue.comments.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{issue.comments.length}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}