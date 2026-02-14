import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import ClientForm from "./pages/ClientForm";
import Policies from "./pages/Policies";
import PolicyDetails from "./pages/PolicyDetails";
import PolicyForm from "./pages/PolicyForm";
import Claims from "./pages/Claims";
import ClaimDetails from "./pages/ClaimDetails";
import ClaimForm from "./pages/ClaimForm";
import Reminders from "./pages/Reminders";
import ReminderForm from "./pages/ReminderForm";
import Targets from "./pages/Targets";
import TargetForm from "./pages/TargetForm";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="clients/edit/:id" element={<ClientForm />} />
          <Route path="clients/:id" element={<ClientDetails />} />

          <Route path="policies" element={<Policies />} />
          <Route path="policies/new" element={<PolicyForm />} />
          <Route path="policies/edit/:id" element={<PolicyForm />} />
          <Route path="policies/:id" element={<PolicyDetails />} />

          <Route path="claims" element={<Claims />} />
          <Route path="claims/new" element={<ClaimForm />} />
          <Route path="claims/edit/:id" element={<ClaimForm />} />
          <Route path="claims/:id" element={<ClaimDetails />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="reminders/new" element={<ReminderForm />} />
          <Route path="reminders/edit/:id" element={<ReminderForm />} />
          <Route path="targets" element={<Targets />} />
          <Route path="targets/new" element={<TargetForm />} />
          <Route path="targets/edit/:id" element={<TargetForm />} />

          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
