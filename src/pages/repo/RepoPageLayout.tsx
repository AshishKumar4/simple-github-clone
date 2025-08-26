import { Outlet, useParams, NavLink, Link } from 'react-router-dom';
import { Book, Code, GitPullRequest, AlertCircle, Star, GitFork, Eye } from 'lucide-react';
import { NotFoundPage } from '../NotFoundPage';
import { Button } from '@/components/ui/button';
import { useRepository } from '@/hooks/use-repo-data';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
export function RepoPageLayout() {
  const { user, repo: repoName } = useParams<{ user: string; repo: string }>();
  const { data: repo, isLoading, isError } = useRepository(user!, repoName!);
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <div className="flex space-x-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (isError || !repo) {
    return <NotFoundPage />;
  }
  const navItems = [
    { name: 'Code', path: '', icon: Code, end: true },
    { name: 'Issues', path: 'issues', icon: AlertCircle, count: repo.issues.length },
    { name: 'Pull Requests', path: 'pulls', icon: GitPullRequest, count: repo.pullRequests.length },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xl">
          <Book className="h-5 w-5 text-muted-foreground" />
          <Link to={`/${repo.owner.username}`} className="text-blue-500 hover:underline">{repo.owner.username}</Link>
          <span className="text-muted-foreground">/</span>
          <Link to={`/${repo.owner.username}/${repo.name}`} className="font-semibold">{repo.name}</Link>
          <span className="text-xs border rounded-full px-2 py-0.5 text-muted-foreground">{repo.isPrivate ? 'Private' : 'Public'}</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>Watch</span>
                <span className="ml-2 bg-muted px-2 rounded-md">{repo.watchers}</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <GitFork className="h-4 w-4" />
                <span>Fork</span>
                <span className="ml-2 bg-muted px-2 rounded-md">{repo.forks}</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>Star</span>
                <span className="ml-2 bg-muted px-2 rounded-md">{repo.stars}</span>
            </Button>
        </div>
      </div>
      <div className="mt-6">
        <div className="border-b">
          <nav className="-mb-px flex space-x-6">
            {navItems.map(item => (
              <NavLink
                key={item.name}
                to={`/${user}/${repoName}/${item.path}`}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-1 py-3 border-b-2 text-sm font-medium ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-primary hover:border-gray-300'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
                {item.count !== undefined && <span className="bg-muted text-muted-foreground rounded-full px-2 text-xs">{item.count}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-6">
          <Outlet context={{ repo }} />
        </div>
      </div>
    </div>
  );
}