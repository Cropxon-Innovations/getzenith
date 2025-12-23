import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ZenithLogo } from '@/components/ZenithLogo';
import { VerificationBadge, VerificationStatus } from '@/components/admin/VerificationBadge';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminMobileDrawer } from '@/components/admin/AdminMobileDrawer';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, tenant, signOut } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const emailStatus: VerificationStatus = user?.email_confirmed_at ? 'verified' : 'pending';
  const phoneStatus: VerificationStatus = user?.phone_confirmed_at ? 'verified' : 'unverified';

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      <AdminMobileDrawer
        open={mobileDrawerOpen}
        onOpenChange={setMobileDrawerOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center px-4 gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileDrawerOpen(true)}
          >
            <Menu size={20} />
          </Button>

          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-2">
            <ZenithLogo size={24} />
            <span className="font-semibold text-sm truncate max-w-[120px]">
              {tenant?.name || 'Dashboard'}
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Verification Badges - Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <VerificationBadge type="email" status={emailStatus} size="sm" />
              <VerificationBadge type="phone" status={phoneStatus} size="sm" />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>

            {/* Sign Out */}
            <Button variant="ghost" size="icon" onClick={() => signOut()}>
              <LogOut size={18} />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;