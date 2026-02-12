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
import Claims from "./pages/Claims";
import ClaimDetails from "./pages/ClaimDetails";
import Reminders from "./pages/Reminders";
import Targets from "./pages/Targets";
import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
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
          <Route path="clients/:id" element={<ClientDetails />} />
          <Route path="policies" element={<Policies />} />
          <Route path="policies/:id" element={<PolicyDetails />} />
          <Route path="claims" element={<Claims />} />
          <Route path="claims/:id" element={<ClaimDetails />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="targets" element={<Targets />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
