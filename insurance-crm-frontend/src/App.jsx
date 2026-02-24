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
import Targets from "./pages/Targets";
import TargetForm from "./pages/TargetForm";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import TaskForm from "./pages/TaskForm";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

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
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
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

          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/new" element={<TaskForm />} />
          <Route path="tasks/edit/:id" element={<TaskForm />} />

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
