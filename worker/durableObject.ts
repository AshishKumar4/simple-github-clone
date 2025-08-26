import { DurableObject, DurableObjectState } from "cloudflare:workers";
import { CreateRepositoryPayload, DORepositoryState } from './types';
import { Repository } from '../src/lib/types';
import { mockRepositories, mockUsers } from '../src/lib/mock-data';
import { Env } from "./core-utils";
// **DO NOT MODIFY THE CLASS NAME**
export class GlobalDurableObject extends DurableObject {
    constructor(state: DurableObjectState, env: Env) {
        super(state, env);
        // Use a pattern to ensure initialization only runs once
        this.ctx.waitUntil(this.initializeData());
    }
    private async initializeData() {
        const hasInitialized = await this.ctx.storage.get<boolean>("initialized");
        if (!hasInitialized) {
            const repositories: { [id: string]: Repository } = {};
            mockRepositories.forEach(repo => {
                repositories[repo.id] = repo;
            });
            await this.ctx.storage.put("repositories", repositories);
            await this.ctx.storage.put("initialized", true);
        }
    }
    // Repository management methods
    async createRepository(payload: CreateRepositoryPayload): Promise<Repository> {
        const repositories = await this.ctx.storage.get<DORepositoryState>("repositories") || {};
        const owner = mockUsers.find(u => u.id === payload.ownerId); // Using mockUsers for owner for now
        if (!owner) {
            throw new Error("Owner not found.");
        }
        const newRepo: Repository = {
            id: `repo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: payload.name,
            owner: owner,
            description: payload.description || '',
            isPrivate: payload.isPrivate,
            stars: 0,
            forks: 0,
            watchers: 1,
            issues: [],
            pullRequests: [],
            files: [{ type: 'file', name: 'README.md', path: 'README.md', content: `# ${payload.name}\n${payload.description || ''}` }],
            updatedAt: new Date().toISOString(),
            language: 'TypeScript', // Default language for new repos
        };
        repositories[newRepo.id] = newRepo;
        await this.ctx.storage.put("repositories", repositories);
        return newRepo;
    }
    async getRepositories(): Promise<Repository[]> {
        const repositories = await this.ctx.storage.get<DORepositoryState>("repositories");
        return repositories ? Object.values(repositories).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) : [];
    }
    async getRepository(ownerUsername: string, repoName: string): Promise<Repository | undefined> {
        const repositories = await this.ctx.storage.get<DORepositoryState>("repositories");
        if (!repositories) return undefined;
        return Object.values(repositories).find(repo => repo.owner.username === ownerUsername && repo.name === repoName);
    }
}