import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { DashboardPage } from './pages/DashboardPage';
import { NewRepoPage } from './pages/NewRepoPage';
import { RepoPageLayout } from './pages/repo/RepoPageLayout';
import { RepoCodeView } from './pages/repo/RepoCodeView';
import { RepoIssuesView } from './pages/repo/RepoIssuesView';
import { RepoPullsView } from './pages/repo/RepoPullsView';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "new", element: <NewRepoPage /> },
      {
        path: "/:user/:repo",
        element: <RepoPageLayout />,
        children: [
          { index: true, element: <RepoCodeView /> },
          { path: "issues", element: <RepoIssuesView /> },
          { path: "pulls", element: <RepoPullsView /> },
        ]
      },
      { path: "/:user/:repo/issues/:issueId", element: <IssueDetailPage /> },
      // Add pull request detail page later
      { path: "*", element: <NotFoundPage /> }
    ]
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)