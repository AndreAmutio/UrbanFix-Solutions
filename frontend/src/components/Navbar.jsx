import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="bg-blue-600 px-6 py-4 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          UrbanFix
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/" className="transition-colors hover:text-blue-200">
            Inicio
          </Link>

          <Link to="/login" className="transition-colors hover:text-blue-200">
            Iniciar sesión
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-white px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-50"> 
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
}