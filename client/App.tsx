import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./contexts/SidebarContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Chatbot from "./pages/Chatbot";
import ComputerVision from "./pages/ComputerVision";
import DiseaseDetection from "./pages/DiseaseDetection";
import VaccinationTracker from "./pages/VaccinationTracker";
import ExerciseGuidance from "./pages/ExerciseGuidance";
import NotFound from "./pages/NotFound";

// Suppress known Recharts defaultProps warning in development
if (typeof console !== 'undefined' && import.meta.env && import.meta.env.DEV) {
  const originalConsoleError = console.error.bind(console);
  console.error = (...args: any[]) => {
    try {
      const msg = args[0];
      if (typeof msg === 'string' && msg.includes('Support for defaultProps will be removed from function components')) {
        return;
      }
    } catch (e) {
      // fallthrough to original
    }
    originalConsoleError(...args);
  };
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/chatbot" element={<Chatbot />} />
            <Route
              path="/dashboard/computer-vision"
              element={<ComputerVision />}
            />
            <Route
              path="/dashboard/disease-detection"
              element={<DiseaseDetection />}
            />
            <Route
              path="/dashboard/vaccination-tracker"
              element={<VaccinationTracker />}
            />
            <Route
              path="/dashboard/exercise-guidance"
              element={<ExerciseGuidance />}
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
