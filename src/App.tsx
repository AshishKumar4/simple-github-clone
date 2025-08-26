import { Outlet } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ThemeProvider } from './components/ThemeToggle';
import { Toaster } from "@/components/ui/sonner"
function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppLayout />
        <Toaster />
    </ThemeProvider>
  );
}