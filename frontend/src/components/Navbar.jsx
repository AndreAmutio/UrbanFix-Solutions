import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="absolute left-0 top-0 z-20 w-full border-b border-white/20 bg-[#0B1F3A]/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="text-2xl font-extrabold text-white">
          Urban<span className="text-[#2DA8FF]">Fix</span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          <Link
            to="/"
            className="font-medium text-white transition hover:text-[#2DA8FF]"
          >
            Inicio
          </Link>
          <a href="#nosotros" className="font-medium text-white hover:text-[#2DA8FF]">
            Nosotros
          </a>
          <a
            href="#servicios"
            className="font-medium text-white transition hover:text-[#2DA8FF]"
          >
            Servicios
          </a>
          <a
            href="#como-funciona"
            className="font-medium text-white transition hover:text-[#2DA8FF]"
          >
            Cómo funciona
          </a>
              
           <Link
           to="/login"
           className="rounded-lg bg-[#1976FF] px-5 py-2.5 font-semibold text-white hover:bg-[#0f65e8]"
        >
         Iniciar sesión
        </Link>
        </div>
      </div>
    </nav>
  );
}