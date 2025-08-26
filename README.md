# Vertex: The Collaborative Code Platform

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/AshishKumar4/simple-github-clone)

Vertex is a full-fledged, high-performance Git repository hosting service built on Cloudflare's edge network. It's designed as a minimalist, beautiful, and highly responsive clone of GitHub, focusing on core functionalities like repository management, code browsing, issue tracking, and pull requests. The application features a clean, intuitive interface with light and dark themes, ensuring a seamless experience for developers.

## ✨ Key Features

-   **Repository Management**: Create, view, and manage your Git repositories.
-   **Code Browsing**: A clean interface for browsing files and directories with syntax highlighting.
-   **Issue Tracking**: A complete issue tracking system to manage tasks, bugs, and enhancements.
-   **Pull Requests**: Collaborative code review and merging workflows.
-   **Built for Performance**: Leverages the Cloudflare edge network for a fast, responsive experience worldwide.
-   **Modern UI/UX**: A minimalist, beautiful design with both light and dark themes, built with shadcn-ui and Tailwind CSS.

## 🚀 Technology Stack

-   **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **UI**: [shadcn-ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
-   **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
-   **Backend**: [Cloudflare Workers](https://workers.cloudflare.com/) with [Hono](https://hono.dev/)
-   **Database/State**: [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) & [KV](https://developers.cloudflare.com/kv/)
-   **Package Manager**: [Bun](https://bun.sh/)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/docs/installation) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and configured.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/vertex.git
    cd vertex
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Configure Cloudflare Wrangler:**
    Rename `wrangler.jsonc.example` to `wrangler.jsonc` and fill in your Cloudflare account details. You may also need to create a `.dev.vars` file for local development secrets if the project requires them.

### Running Locally

To start the development server, which includes both the Vite frontend and the Wrangler backend, run:

```bash
bun run dev
```

This will start the application on `http://localhost:3000` (or another port if specified).

## 🛠️ Development Scripts

This project comes with several scripts to help with development:

-   `bun run dev`: Starts the local development server with hot-reloading.
-   `bun run build`: Builds the frontend application for production.
-   `bun run lint`: Lints the codebase using ESLint to check for errors and code style issues.
-   `bun run deploy`: Builds and deploys the application to your Cloudflare account.

## 部署 (Deployment)

This project is designed for seamless deployment to the Cloudflare network.

To deploy your application, simply run the deploy script:

```bash
bun run deploy
```

This command will build the Vite application and deploy it along with the worker using the Wrangler CLI.

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/AshishKumar4/simple-github-clone)

## 📂 Project Structure

The codebase is organized into two main parts:

-   `src/`: Contains the entire React frontend application, including pages, components, hooks, and state management logic.
-   `worker/`: Contains the Cloudflare Worker backend code, including the Hono API router, Durable Object definitions, and types.

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.