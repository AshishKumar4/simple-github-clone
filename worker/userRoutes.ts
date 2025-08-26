import { Hono } from "hono";
import { Env } from './core-utils';
import { CreateRepositoryPayload, RepositoryResponse, ListRepositoriesResponse } from './types';
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
            const newRepo = await durableObject.createRepository(payload);
            return c.json({ success: true, data: newRepo });
        } catch (error: any) {
            return c.json({ success: false, error: error.message || "Failed to create repository" }, 500);
        }
    });
    app.get('/api/repos/:owner/:repoName', async (c) => {
        try {
            const { owner, repoName } = c.req.param();
            if (!owner || !repoName) {
                return c.json({ success: false, error: "Owner and repository name are required" }, 400);
            }
            const durableObject = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
            const repo = await durableObject.getRepository(owner, repoName);
            if (!repo) {
                return c.json({ success: false, error: "Repository not found" }, 404);
            }
            return c.json({ success: true, data: repo });
        } catch (error: any) {
            return c.json({ success: false, error: error.message || "Failed to get repository" }, 500);
        }
    });
}