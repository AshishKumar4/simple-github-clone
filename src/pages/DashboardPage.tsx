import { Link } from 'react-router-dom';
import { Book, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
export function DashboardPage() {
  const { currentUser, repositories } = useAuthStore();
  const userRepos = repositories.filter(repo => repo.owner.id === currentUser?.id);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Repositories</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/new">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Link>
            </Button>
          </div>
          <Input placeholder="Find a repository..." />
          <ul className="space-y-2">
            {userRepos.map(repo => (
              <li key={repo.id}>
                <Link to={`/${repo.owner.username}/${repo.name}`} className="flex items-center space-x-3 text-sm hover:underline">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={repo.owner.avatarUrl} />
                    <AvatarFallback>{repo.owner.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{repo.owner.username} / <strong>{repo.name}</strong></span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <main className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repositories.slice(0, 5).map(repo => (
                  <div key={repo.id} className="flex items-start space-x-4 p-4 border-b last:border-b-0">
                    <Book className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <Link to={`/${repo.owner.username}`} className="font-semibold hover:underline">{repo.owner.username}</Link> created a new repository{' '}
                        <Link to={`/${repo.owner.username}/${repo.name}`} className="font-semibold hover:underline">{repo.owner.username}/{repo.name}</Link>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">You've reached the end of the feed.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}