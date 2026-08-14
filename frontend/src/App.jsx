import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ClienteDashboard from "./pages/cliente/ClienteDashboard";
import TecnicoDashboard from "./pages/tecnico/TecnicoDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cliente"
          element={
            <ProtectedRoute role="CLIENTE">
              <ClienteDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tecnico"
          element={
            <ProtectedRoute role="TECNICO">
              <TecnicoDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;