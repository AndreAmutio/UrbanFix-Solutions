import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import api from "../../services/api";

import imagenPortada from "../../assets/imagenes/2.jpeg";

const registerContent = {
  CLIENTE: {
    badge: "Cuenta de cliente",
    title: "Solicitá servicios de confianza",
    description:
      "Creá tu cuenta para encontrar técnicos y gestionar tus solicitudes.",
    buttonText: "Crear cuenta de cliente",
    badgeClasses: "bg-blue-100 text-blue-700",
    buttonClasses: "bg-[#1976FF] hover:bg-[#0f65e8] focus:ring-blue-300",
    footerText:
      "La dirección del trabajo se solicitará al crear cada servicio.",
  },

  TECNICO: {
    badge: "Cuenta de técnico",
    title: "Ofrecé tus servicios en UrbanFix",
    description:
      "Creá tu cuenta y conectate con clientes que necesitan tu trabajo.",
    buttonText: "Crear cuenta de técnico",
    badgeClasses: "bg-cyan-100 text-cyan-700",
    buttonClasses: "bg-[#0891B2] hover:bg-[#0E7490] focus:ring-cyan-300",
    footerText:
      "Después podrás consultar las solicitudes de servicio disponibles.",
  },
};

export default function Register() {
  const [searchParams] = useSearchParams();

  const requestedRole = searchParams.get("role")?.toUpperCase();
  const role = requestedRole === "TECNICO" ? "TECNICO" : "CLIENTE";
  const content = registerContent[role];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
      };

      const phone = formData.phone.trim();

      if (phone) {
        registerData.phone = phone;
      }

      const { data } = await api.post("/auth/register", registerData);

      login(data.user, data.token);

      const redirects = {
        CLIENTE: "/cliente",
        TECNICO: "/tecnico",
      };

      navigate(redirects[data.user.role] || "/", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Error al crear la cuenta",
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

      <section className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl sm:p-10">
        <span
          className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${content.badgeClasses}`}
        >
          {content.badge}
        </span>

        <h1 className="mt-5 text-3xl font-extrabold text-[#0B1F3A]">
          {content.title}
        </h1>

        <p className="mt-3 leading-6 text-gray-600">
          {content.description}
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
            label="Nombre completo"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Teléfono (opcional)"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg px-6 py-3 font-semibold text-white transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${content.buttonClasses}`}
          >
            {loading ? "Creando cuenta..." : content.buttonText}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          ¿Ya tenés una cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#1976FF] hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-gray-500">
          {content.footerText}
        </p>
      </section>
    </main>
  );
}