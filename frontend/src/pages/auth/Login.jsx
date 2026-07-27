import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import api from '../../services/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', formData);

      login(data.user, data.token);

      const redirects = {
        CLIENTE: '/cliente',
        TECNICO: '/tecnico',
        ADMIN: '/admin',
      };

      const destination = redirects[data.user.role];

      if (destination) {
        navigate(destination);
      } else {
        setError('El usuario tiene un rol no reconocido');
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 'Error al iniciar sesión'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Iniciar sesión
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <Input
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={(e) =>setFormData({...formData,password: e.target.value,})}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </div>
    </main>
  );
}