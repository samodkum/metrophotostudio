import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserDashboard from "./pages/UserDashboard";
import CategoryDetail from "./pages/CategoryDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import GalleryManagement from "./pages/admin/GalleryManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import ServicesManagement from "./pages/admin/ServicesManagement";
import TestimonialsManagement from "./pages/admin/TestimonialsManagement";
import InquiryManagement from "./pages/admin/InquiryManagement";
import SiteSettings from "./pages/admin/SiteSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/category/:slug" element={<CategoryDetail />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="services" element={<ServicesManagement />} />
              <Route path="testimonials" element={<TestimonialsManagement />} />
              <Route path="inquiries" element={<InquiryManagement />} />
              <Route path="settings" element={<SiteSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
