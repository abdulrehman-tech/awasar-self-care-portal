import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";
import AppLayout from "@/components/layout/AppLayout";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import MyServices from "@/pages/MyServices";
import BillingPage from "@/pages/BillingPage";
import RequestsPage from "@/pages/RequestsPage";
import SupportPage from "@/pages/SupportPage";
import KnowledgeBasePage from "@/pages/KnowledgeBasePage";
import OrdersPage from "@/pages/OrdersPage";
import NetworkStatusPage from "@/pages/NetworkStatusPage";
import ProfilePage from "@/pages/ProfilePage";
import NotificationsPage from "@/pages/NotificationsPage";
import CatalogPage from "@/pages/CatalogPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/services" element={<MyServices />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/network-status" element={<NetworkStatusPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
