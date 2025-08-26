import { Hono } from "hono";
import { Env } from './core-utils';
import { CreateRepositoryPayload, RepositoryResponse, ListRepositoriesResponse, CreateIssuePayload, IssueResponse, ListIssuesResponse } from './types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Repository API routes
    app.get('/api/repos', async (c) => {
        try {
            const durableObject = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
            const repos = await durableObject.getRepositories();
            return c.json({ success: true, data: repos });
        } catch (error: any) {
            return c.json({ success: false, error: error.message || "Failed to list repositories" }, 500);
        }
    });
    app.post('/api/repos', async (c) => {
        try {
            const payload: CreateRepositoryPayload = await c.req.json();
            if (!payload.name || !payload.ownerId) {
                return c.json({ success: false, error: "Repository name and owner ID are required" }, 400);
            }
            const durableObject = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
            // Assuming ownerId from payload is the userId for creating the repository
            const newRepo = await durableObject.createRepository(payload.ownerId, payload);
            return c.json({ success: true, data: newRepo });
        } catch (error: any) {
            return c.json({ success: false, error: error.message || "Failed to create repository" }, 500);
        }
    });
    app.get('/api/repos/:owner/:repoName', async (c) => {
        try {
            const { owner, repoName } = c.req.param();
            if (!owner || !repoName) {
                return c.json<RepositoryResponse>({ success: false, error: "Owner and repository name are required" }, 400);
            }
            const durableObject = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
            const repo = await durableObject.getRepository(owner, repoName);
            if (!repo) {
                return c.json<RepositoryResponse>({ success: false, error: "Repository not found" }, 404);
            }
            return c.json<RepositoryResponse>({ success: true, data: repo });
        } catch (error: any) {
            return c.json<RepositoryResponse>({ success: false, error: error.message || "Failed to get repository" }, 500);
        }
    });
    // Issue API routes
    app.get('/api/repos/:owner/:repoName/issues', async (c) => {
        try {
            const { owner, repoName } = c.req.param();
            const durableObject = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
            const issues = await durableObject.getIssues(owner, repoName);
            return c.json<ListIssuesResponse>({ success: true, data: issues });
        } catch (error: any) {
            return c.json<ListIssuesResponse>({ success: false, error: error.message || "Failed to list issues" }, 500);
        }
    });
    app.post('/api/repos/:owner/:repoName/issues', async (c) => {
        try {
            const { owner, repoName } = c.req.param();
            const payload: CreateIssuePayload = await c.req.json();
            if (!payload.title || !payload.authorId) {
                return c.json<IssueResponse>({ success: false, error: "Issue title and author ID are required" }, 400);
            }
            const durableObject = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
            const newIssue = await durableObject.createIssue(owner, repoName, payload);
            return c.json<IssueResponse>({ success: true, data: newIssue });
        } catch (error: any) {
            return c.json<IssueResponse>({ success: false, error: error.message || "Failed to create issue" }, 500);
        }
    });
    app.get('/api/repos/:owner/:repoName/issues/:issueNumber', async (c) => {
        try {
            const { owner, repoName, issueNumber } = c.req.param();
            const parsedIssueNumber = parseInt(issueNumber);
            if (isNaN(parsedIssueNumber)) {
                return c.json<IssueResponse>({ success: false, error: "Invalid issue number provided" }, 400);
            }
            const durableObject = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
            const issue = await durableObject.getIssue(owner, repoName, parsedIssueNumber);
            if (!issue) {
                return c.json<IssueResponse>({ success: false, error: "Issue not found" }, 404);
            }
            return c.json<IssueResponse>({ success: true, data: issue });
        } catch (error: any) {
            return c.json<IssueResponse>({ success: false, error: error.message || "Failed to get issue" }, 500);
        }
    });
}