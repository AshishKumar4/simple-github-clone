import { GitCommit } from 'lucide-react';
export function Footer() {
  const links = ['Terms', 'Privacy', 'Security', 'Status', 'Docs', 'Contact'];
  return (
    <footer className="border-t mt-12 py-8 text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <GitCommit className="h-5 w-5" />
          <span>© {new Date().getFullYear()} Vertex, Inc.</span>
        </div>
        <div className="flex items-center space-x-4">
          {links.map(link => (
            <a key={link} href="#" className="text-sm hover:text-primary hover:underline">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}