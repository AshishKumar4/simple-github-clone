import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Go back to Dashboard</Link>
      </Button>
    </div>
  );
}