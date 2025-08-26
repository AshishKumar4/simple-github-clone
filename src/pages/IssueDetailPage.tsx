import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { NotFoundPage } from './NotFoundPage';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
// Mock Markdown Preview
const MarkdownPreview = ({ source }: { source: string }) => (
    <div className="prose dark:prose-invert max-w-none">
        <pre className="whitespace-pre-wrap font-sans">{source}</pre>
    </div>
);
export function IssueDetailPage() {
  const { user, repo: repoName, issueId } = useParams<{ user: string; repo: string; issueId: string }>();
  const { repositories } = useAuthStore();
  const repo = repositories.find(r => r.owner.username === user && r.name === repoName);
  const issue = repo?.issues.find(i => i.number.toString() === issueId);
  if (!repo || !issue) {
    return <NotFoundPage />;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold flex items-center">
          {issue.title} <span className="text-3xl text-muted-foreground ml-2">#{issue.number}</span>
        </h1>
        <div className="flex items-center space-x-2 mt-2 text-sm">
          {issue.state === 'open' ? (
            <Badge variant="secondary" className="bg-green-600 text-white"><AlertCircle className="h-4 w-4 mr-1" />Open</Badge>
          ) : (
            <Badge variant="secondary" className="bg-purple-600 text-white"><CheckCircle2 className="h-4 w-4 mr-1" />Closed</Badge>
          )}
          <span className="font-semibold">{issue.user.username}</span>
          <span className="text-muted-foreground">
            opened this issue {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{issue.comments.length} comments</span>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20 flex-row items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={issue.user.avatarUrl} />
                <AvatarFallback>{issue.user.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold">{issue.user.username}</span>
                <span className="text-sm text-muted-foreground ml-2">commented {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <MarkdownPreview source={issue.body} />
            </CardContent>
          </Card>
          {issue.comments.map(comment => (
            <div key={comment.id} className="flex space-x-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user.avatarUrl} />
                    <AvatarFallback>{comment.user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <Card className="flex-1">
                    <CardHeader className="bg-muted/50 flex-row items-center space-x-2 text-sm">
                        <span className="font-semibold">{comment.user.username}</span>
                        <span className="text-muted-foreground">commented {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <MarkdownPreview source={comment.body} />
                    </CardContent>
                </Card>
            </div>
          ))}
          <Separator />
          <div className="flex space-x-4">
            <Avatar className="h-10 w-10">
                <AvatarImage src={issue.user.avatarUrl} />
                <AvatarFallback>{issue.user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <Card className="flex-1">
                <CardHeader>
                    <Textarea placeholder="Leave a comment" />
                </CardHeader>
                <CardContent className="flex justify-end">
                    <Button>Comment</Button>
                </CardContent>
            </Card>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Assignees</h3>
            {issue.assignees.length > 0 ? issue.assignees.map(a => (
              <div key={a.id} className="flex items-center space-x-2">
                <Avatar className="h-6 w-6"><AvatarImage src={a.avatarUrl} /><AvatarFallback>{a.username.charAt(0)}</AvatarFallback></Avatar>
                <span className="text-sm font-medium">{a.username}</span>
              </div>
            )) : <p className="text-sm text-muted-foreground">No one assigned</p>}
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Labels</h3>
            <div className="flex flex-wrap gap-1">
                {issue.labels.map(l => (
                    <Badge key={l.id} variant="outline" style={{borderColor: `#${l.color}`, color: `#${l.color}`}}>{l.name}</Badge>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}