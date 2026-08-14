import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) { //children: panel agregado que se quiere proteger/role: rol requerido por la ruta
  const { user, token, loading } = useAuth(); //obtengo el usuario

  if (loading) {
    return <p className="p-6 text-center">Cargando...</p>;
  }

  if (!token || !user) { //se comprueba que exista tanto el token como el usuario. Si falta alguno, vuelve al login.
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    const redirects = {
      CLIENTE: "/cliente",
      TECNICO: "/tecnico",
      ADMIN: "/admin",
    };

    return <Navigate to={redirects[user.role] || "/"} replace />;
  }

  return children;
}