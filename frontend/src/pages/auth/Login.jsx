import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import api from "../../services/api";

import imagenPortada from "../../assets/imagenes/2.jpeg";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginData = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const { data } = await api.post("/auth/login", loginData);

      login(data.user, data.token);

      const redirects = {
        CLIENTE: "/cliente",
        TECNICO: "/tecnico",
        ADMIN: "/admin",
      };

      const destination = redirects[data.user.role];

      if (!destination) {
        setError("El usuario tiene un rol no reconocido");
        return;
      }

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "No pudimos iniciar sesión. Revisá tus datos.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-12"
      style={{ backgroundImage: `url(${imagenPortada})` }}
    >
      <div className="absolute inset-0 bg-[#0B1F3A]/80" />

      <Link
        to="/"
        className="absolute left-6 top-6 z-20 text-2xl font-extrabold text-white"
      >
        Urban<span className="text-[#2DA8FF]">Fix</span>
      </Link>

      <section className="relative z-10 w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-10">
        <span className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
          Bienvenido nuevamente
        </span>

        <h1 className="mt-5 text-3xl font-extrabold text-[#0B1F3A]">
          Iniciar sesión
        </h1>

        <p className="mt-3 leading-6 text-gray-600">
          Ingresá a tu cuenta para gestionar tus solicitudes o servicios.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#1976FF] px-6 py-3 font-semibold text-white transition hover:bg-[#0f65e8] focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-7 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-600">
            ¿Todavía no tenés una cuenta?
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              to="/register?role=CLIENTE"
              className="rounded-lg border border-[#1976FF] px-4 py-2.5 text-center text-sm font-semibold text-[#1976FF] transition hover:bg-blue-50"
            >
              Registrarme como cliente
            </Link>

            <Link
              to="/register?role=TECNICO"
              className="rounded-lg border border-[#0891B2] px-4 py-2.5 text-center text-sm font-semibold text-[#08758e] transition hover:bg-cyan-50"
            >
              Registrarme como técnico
            </Link>
          </div>
        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-sm font-medium text-gray-500 transition hover:text-[#1976FF]"
        >
          ← Volver al inicio
        </Link>
      </section>
    </main>
  );
}