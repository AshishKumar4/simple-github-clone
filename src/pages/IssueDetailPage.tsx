import { useParams, Link } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useIssue } from '@/hooks/use-issue-data';
import { Skeleton } from '@/components/ui/skeleton';
import MarkdownPreview from '@uiw/react-markdown-preview';
export function IssueDetailPage() {
  const { user, repo: repoName, issueId } = useParams<{ user: string; repo: string; issueId: string }>();
  const { data: issue, isLoading, isError } = useIssue(user!, repoName!, parseInt(issueId!));
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }
  if (isError || !issue) {
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
            <Badge variant="secondary" className="bg-green-600 text-white hover:bg-green-700"><AlertCircle className="h-4 w-4 mr-1" />Open</Badge>
          ) : (
            <Badge variant="secondary" className="bg-purple-600 text-white hover:bg-purple-700"><CheckCircle2 className="h-4 w-4 mr-1" />Closed</Badge>
          )}
          <Link to={`/${issue.user.username}`} className="font-semibold hover:text-primary">{issue.user.username}</Link>
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
          <div className="flex space-x-4">
            <Avatar className="h-10 w-10 hidden sm:block">
              <AvatarImage src={issue.user.avatarUrl} />
              <AvatarFallback>{issue.user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <Card className="flex-1 border-2 border-primary/20">
              <CardHeader className="bg-muted/30 flex-row items-center space-x-2 text-sm">
                <Link to={`/${issue.user.username}`} className="font-semibold hover:text-primary">{issue.user.username}</Link>
                <span className="text-muted-foreground">commented {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
              </CardHeader>
              <CardContent className="pt-4">
                <MarkdownPreview source={issue.body} />
              </CardContent>
            </Card>
          </div>
          {issue.comments.map(comment => (
            <div key={comment.id} className="flex space-x-4">
                <Avatar className="h-10 w-10 hidden sm:block">
                    <AvatarImage src={comment.user.avatarUrl} />
                    <AvatarFallback>{comment.user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <Card className="flex-1">
                    <CardHeader className="bg-muted/50 flex-row items-center space-x-2 text-sm">
                        <Link to={`/${comment.user.username}`} className="font-semibold hover:text-primary">{comment.user.username}</Link>
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
            <Avatar className="h-10 w-10 hidden sm:block">
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
                {issue.labels.length > 0 ? issue.labels.map(l => (
                    <Badge key={l.id} variant="outline" style={{borderColor: `#${l.color}`, color: `#${l.color}`}}>{l.name}</Badge>
                )) : <p className="text-sm text-muted-foreground">None yet</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}