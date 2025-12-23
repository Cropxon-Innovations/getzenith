import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PageTransition } from "@/components/PageTransition";

// Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import Docs from "./pages/Docs";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Docs pages
import GettingStarted from "./pages/docs/GettingStarted";
import APIReference from "./pages/docs/APIReference";
import SDKGuide from "./pages/docs/SDKGuide";
import DocsIntegrations from "./pages/docs/Integrations";
import AISystems from "./pages/docs/AISystems";
import Automation from "./pages/docs/Automation";

// Auth pages
import EmailConfirmation from "./pages/EmailConfirmation";
import Onboarding from "./pages/Onboarding";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminSettings from "./pages/AdminSettings";
import Analytics from "./pages/admin/Analytics";
import TeamManagement from "./pages/admin/TeamManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import Integrations from "./pages/admin/Integrations";
import BusinessManagement from "./pages/admin/BusinessManagement";
import Billing from "./pages/admin/Billing";
import Notifications from "./pages/admin/Notifications";
import Messaging from "./pages/admin/Messaging";
import Meetings from "./pages/admin/Meetings";
import MeetingRoom from "./pages/MeetingRoom";

// Studio
import Studio from "./pages/Studio";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/docs" element={<PageTransition><Docs /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
        
        {/* Docs Routes */}
        <Route path="/docs/getting-started" element={<PageTransition><GettingStarted /></PageTransition>} />
        <Route path="/docs/api-reference" element={<PageTransition><APIReference /></PageTransition>} />
        <Route path="/docs/sdk" element={<PageTransition><SDKGuide /></PageTransition>} />
        <Route path="/docs/integrations" element={<PageTransition><DocsIntegrations /></PageTransition>} />
        <Route path="/docs/ai-systems" element={<PageTransition><AISystems /></PageTransition>} />
        <Route path="/docs/automation" element={<PageTransition><Automation /></PageTransition>} />
        
        {/* Auth Routes */}
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/auth/confirm" element={<PageTransition><EmailConfirmation /></PageTransition>} />
        <Route path="/get-started" element={<PageTransition><Onboarding /></PageTransition>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/admin/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
        <Route path="/admin/settings" element={<PageTransition><AdminSettings /></PageTransition>} />
        <Route path="/admin/analytics" element={<PageTransition><Analytics /></PageTransition>} />
        <Route path="/admin/team" element={<PageTransition><TeamManagement /></PageTransition>} />
        <Route path="/admin/team/roles" element={<PageTransition><TeamManagement /></PageTransition>} />
        <Route path="/admin/team/invites" element={<PageTransition><TeamManagement /></PageTransition>} />
        <Route path="/admin/content" element={<PageTransition><ContentManagement /></PageTransition>} />
        <Route path="/admin/content/courses" element={<PageTransition><ContentManagement /></PageTransition>} />
        <Route path="/admin/content/media" element={<PageTransition><ContentManagement /></PageTransition>} />
        <Route path="/admin/integrations" element={<PageTransition><Integrations /></PageTransition>} />
        <Route path="/admin/business" element={<PageTransition><BusinessManagement /></PageTransition>} />
        <Route path="/admin/billing" element={<PageTransition><Billing /></PageTransition>} />
        <Route path="/admin/notifications" element={<PageTransition><Notifications /></PageTransition>} />
        <Route path="/admin/messaging" element={<PageTransition><Messaging /></PageTransition>} />
        <Route path="/admin/meetings" element={<PageTransition><Meetings /></PageTransition>} />
        <Route path="/admin/growth" element={<PageTransition><Analytics /></PageTransition>} />
        
        {/* Meeting Room */}
        <Route path="/meet/:meetingId" element={<PageTransition><MeetingRoom /></PageTransition>} />
        
        {/* Studio Routes */}
        <Route path="/studio/:studioType" element={<PageTransition><Studio /></PageTransition>} />
        <Route path="/studio" element={<PageTransition><Studio /></PageTransition>} />
        
        {/* 404 */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
