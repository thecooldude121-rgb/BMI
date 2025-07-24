import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import Header from "./components/Layout/Header";
import Dashboard from "@/pages/Dashboard";
import CRMModule from "./pages/CRM/CRMModule";
import MeetingModule from "./pages/Meeting/MeetingModule";
import HRMSModule from "./pages/HRMS/HRMSModule";
import GamificationPage from "./pages/Gamification/GamificationPage";
import LeadGeneration from "./pages/LeadGeneration/LeadGeneration";
import Calendar from "./pages/Calendar/Calendar";
import Analytics from "@/pages/Analytics/Analytics";
import Settings from "@/pages/Settings/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/crm/:rest*" component={CRMModule} />
          <Route path="/meetings/:rest*" component={MeetingModule} />
          <Route path="/meetings" component={MeetingModule} />
          <Route path="/hrms/:rest*" component={HRMSModule} />
          <Route path="/hrms" component={HRMSModule} />
          <Route path="/gamification" component={GamificationPage} />
          <Route path="/lead-generation" component={LeadGeneration} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
