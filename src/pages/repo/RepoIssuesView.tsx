import React, { useState } from 'react';
import { useOutletContext, Link, useParams } from 'react-router-dom';
import { Repository } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIssues, useCreateIssue } from '@/hooks/use-issue-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
const newIssueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().optional(),
});
type NewIssueFormValues = z.infer<typeof newIssueSchema>;
export function RepoIssuesView() {
  const { repo } = useOutletContext<{ repo: Repository }>();
  const { user, repo: repoName } = useParams<{ user: string; repo: string }>();
  const { data: issues, isLoading, isError } = useIssues(user!, repoName!);
  const createIssueMutation = useCreateIssue(user!, repoName!);
  const { currentUser } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<NewIssueFormValues>({
    resolver: zodResolver(newIssueSchema),
    defaultValues: { title: '', body: '' },
  });
  const onSubmit = (data: NewIssueFormValues) => {
    if (!currentUser) {
      toast.error("You must be logged in to create an issue.");
      return;
    }
    createIssueMutation.mutate({ ...data, authorId: currentUser.id }, {
      onSuccess: () => {
        form.reset();
        setIsDialogOpen(false);
      }
    });
  };
  const openIssues = issues?.filter(i => i.state === 'open') || [];
  const closedIssues = issues?.filter(i => i.state === 'closed') || [];
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input placeholder="Filter issues" className="w-64" />
          <Button variant="outline">Labels</Button>
          <Button variant="outline">Milestones</Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>New issue</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create a new issue</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="body" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl><Textarea {...field} rows={8} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" disabled={createIssueMutation.isPending}>
                    {createIssueMutation.isPending ? 'Submitting...' : 'Submit new issue'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <div className="p-3 bg-muted/50 border-b text-sm font-medium flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{isLoading ? '...' : openIssues.length} Open</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span>{isLoading ? '...' : closedIssues.length} Closed</span>
            </div>
          </div>
          <div>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-4 p-3"><Skeleton className="h-5 w-5 mt-1" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/4" /></div></div>
              ))
            ) : isError ? (
              <p className="p-4 text-destructive">Failed to load issues.</p>
            ) : issues && issues.length > 0 ? (
              issues.map(issue => (
                <div key={issue.id} className="flex items-start space-x-4 p-3 border-b last:border-b-0">
                  {issue.state === 'open' ? <AlertCircle className="h-5 w-5 text-green-600 mt-1" /> : <CheckCircle2 className="h-5 w-5 text-purple-600 mt-1" />}
                  <div className="flex-1">
                    <Link to={`/${user}/${repoName}/issues/${issue.number}`} className="font-semibold hover:text-blue-500 pr-2">{issue.title}</Link>
                    {issue.labels.map(label => <Badge key={label.id} variant="outline" style={{ borderColor: `#${label.color}`, color: `#${label.color}` }} className="mr-1">{label.name}</Badge>)}
                    <p className="text-xs text-muted-foreground mt-1">#{issue.number} opened {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })} by {issue.user.username}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <TooltipProvider>
                      <div className="flex items-center -space-x-2">
                        {issue.assignees.map(assignee => (
                          <Tooltip key={assignee.id}>
                            <TooltipTrigger><Avatar className="h-5 w-5 border-2 border-background"><AvatarImage src={assignee.avatarUrl} /><AvatarFallback>{assignee.username.charAt(0)}</AvatarFallback></Avatar></TooltipTrigger>
                            <TooltipContent>Assigned to {assignee.username}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TooltipProvider>
                    {issue.comments.length > 0 && <div className="flex items-center space-x-1"><MessageSquare className="h-4 w-4" /><span>{issue.comments.length}</span></div>}
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-muted-foreground">No issues found.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}