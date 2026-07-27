import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import api from "../../services/api";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CLIENTE",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      };

      const { data } = await api.post("/auth/register", registerData);

      login(data.user, data.token);

      const redirects = {
        CLIENTE: "/cliente",
        TECNICO: "/tecnico",
      };

      navigate(redirects[data.user.role] || "/");
    } catch (err) {
      setError(
        err.response?.data?.error || "Error al crear la cuenta",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Crear una cuenta
        </h1>

        <p className="text-gray-600 mb-6">
          Registrate como cliente o técnico.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre completo"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Teléfono"
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
          />

          <Input
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <div>
            <p className="font-medium text-gray-700 mb-2">
              ¿Cómo querés utilizar UrbanFix?
            </p>

            <label className="flex items-center gap-2 mb-2 text-gray-700">
              <input
                type="radio"
                name="role"
                value="CLIENTE"
                checked={formData.role === "CLIENTE"}
                onChange={handleChange}
              />
              Necesito contratar un servicio
            </label>

            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="radio"
                name="role"
                value="TECNICO"
                checked={formData.role === "TECNICO"}
                onChange={handleChange}
              />
              Quiero ofrecer mis servicios
            </label>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarme"}
          </Button>
        </form>
        <p className="text-center text-gray-600 mt-6"> ¿Ya tenés una cuenta?{" "}
         <Link to="/login" className="text-blue-600 font-medium hover:underline"> Iniciar sesión </Link>
        </p>
      </div>
    </main>
  );
}