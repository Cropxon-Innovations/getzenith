import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PageTransition } from "@/components/PageTransition";
import Index from "./pages/Index";
import About from "./pages/About";
import Docs from "./pages/Docs";
import Pricing from "./pages/Pricing";
import GettingStarted from "./pages/docs/GettingStarted";
import APIReference from "./pages/docs/APIReference";
import SDKGuide from "./pages/docs/SDKGuide";
import Integrations from "./pages/docs/Integrations";
import AISystems from "./pages/docs/AISystems";
import Automation from "./pages/docs/Automation";
import Studio from "./pages/Studio";
import Auth from "./pages/Auth";
import GetStarted from "./pages/GetStarted";
import Onboarding from "./pages/Onboarding";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/docs" element={<PageTransition><Docs /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
        <Route path="/docs/getting-started" element={<PageTransition><GettingStarted /></PageTransition>} />
        <Route path="/docs/api-reference" element={<PageTransition><APIReference /></PageTransition>} />
        <Route path="/docs/sdk" element={<PageTransition><SDKGuide /></PageTransition>} />
        <Route path="/docs/integrations" element={<PageTransition><Integrations /></PageTransition>} />
        <Route path="/docs/ai-systems" element={<PageTransition><AISystems /></PageTransition>} />
        <Route path="/docs/automation" element={<PageTransition><Automation /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/get-started" element={<PageTransition><GetStarted /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/admin/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
        <Route path="/studio/:studioType" element={<PageTransition><Studio /></PageTransition>} />
        <Route path="/studio" element={<PageTransition><Studio /></PageTransition>} />
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
