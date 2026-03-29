import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Toaster } from './ui/sonner';

export function AppShell() {
  return (
    <div className="min-h-screen bg-background font-sans anti-aliased flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
