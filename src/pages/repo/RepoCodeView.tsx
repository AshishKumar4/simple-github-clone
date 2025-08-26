import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Repository, FileNode } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { File, Folder, GitCommit, History } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
export function RepoCodeView() {
  const { repo } = useOutletContext<{ repo: Repository }>();
  const [currentPath, setCurrentPath] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };
  const viewFile = (file: FileNode) => {
    setSelectedFile(file);
    setCurrentPath(file.path);
  };
  const getContents = () => {
    if (!currentPath) return repo.files;
    const pathParts = currentPath.split('/');
    let contents = repo.files;
    for (const part of pathParts) {
      const next = contents?.find(item => item.name === part);
      if (next && next.type === 'dir') {
        contents = next.children || [];
      } else {
        // This part of the path does not lead to a directory, so we stop.
        // This can happen if the path points to a file.
        return [];
      }
    }
    return contents;
  };
  const breadcrumbItems = [{ name: repo.name, path: '' }, ...currentPath.split('/').filter(Boolean).map((part, i, arr) => ({
    name: part,
    path: arr.slice(0, i + 1).join('/'),
  }))];
  const contents = getContents();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={repo.owner.avatarUrl} />
              <AvatarFallback>{repo.owner.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{repo.owner.username}</span>
            <span className="text-sm text-muted-foreground ml-4">Latest commit</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-1 text-muted-foreground">
              <GitCommit className="h-4 w-4" />
              <span>abcdef1</span>
            </span>
            <span className="text-muted-foreground">{formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}</span>
            <Button variant="outline" size="sm"><History className="h-4 w-4 mr-2" /> Commits</Button>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item.path}>
                  <BreadcrumbItem>
                    {index === breadcrumbItems.length - 1 ? (
                      <BreadcrumbPage>{item.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo(item.path); }}>{item.name}</a>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </CardHeader>
        <CardContent>
          {selectedFile ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">{selectedFile.name}</h3>
              <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers>
                {selectedFile.content || ''}
              </SyntaxHighlighter>
            </div>
          ) : (
            <div className="border rounded-md">
              {contents.map(item => (
                <div key={item.path} className="flex items-center space-x-4 p-2 border-b last:border-b-0">
                  {item.type === 'dir' ? <Folder className="h-5 w-5 text-blue-500" /> : <File className="h-5 w-5 text-muted-foreground" />}
                  <button
                    onClick={() => {
                      if (item.type === 'dir') {
                        navigateTo(item.path);
                      } else {
                        viewFile(item);
                      }
                    }}
                    className="text-sm hover:underline hover:text-blue-500 flex-1 text-left"
                  >
                    {item.name}
                  </button>
                  <span className="text-sm text-muted-foreground">Latest commit message</span>
                  <span className="text-sm text-muted-foreground text-right">
                    {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {repo.files.find(f => f.name === 'README.md') && !currentPath && !selectedFile && (
        <Card>
            <CardHeader>
                <h3 className="font-semibold">README.md</h3>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans">{repo.files.find(f => f.name === 'README.md')?.content}</pre>
            </CardContent>
        </Card>
      )}
    </div>
  );
}