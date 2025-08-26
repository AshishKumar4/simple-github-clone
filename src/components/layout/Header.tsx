import { Link, NavLink } from 'react-router-dom';
import { GitCommit, Bell, Plus, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth';
import { ThemeToggle } from '../ThemeToggle';
export function Header() {
  const currentUser = useAuthStore((state) => state.currentUser);
  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <GitCommit className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">Vertex</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search or jump to..." className="pl-9 w-64" />
              </div>
              <NavLink to="/pulls" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}>Pull Requests</NavLink>
              <NavLink to="/issues" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}>Issues</NavLink>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Plus className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/new">New repository</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.username} />
                  <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Signed in as <strong>{currentUser?.username}</strong></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Your profile</DropdownMenuItem>
                <DropdownMenuItem>Your repositories</DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                    <ThemeToggle />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}