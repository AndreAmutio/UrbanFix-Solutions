import logoCasita from "../assets/logos/casita.png";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = Boolean(token);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/20 bg-[#0B1F3A]/70 shadow-lg shadow-slate-950/10 backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="Ir al inicio de UrbanFix"
          className="flex items-center gap-4"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden">
            <img
              src={logoCasita}
              alt=""
              className="h-full w-full scale-[2.4] object-contain"
            />
          </span>

          <span className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Urban<span className="text-[#2DA8FF]">Fix</span>
          </span>
        </Link>

        {/* Navegación para escritorio */}
        <div className="hidden items-center gap-7 md:flex">
          <Link
            to="/"
            className="font-medium text-white transition hover:text-[#2DA8FF]"
          >
            Inicio
          </Link>

          <a
            href="/#nosotros"
            className="font-medium text-white transition hover:text-[#2DA8FF]"
          >
            Nosotros
          </a>

          <a
            href="/#servicios"
            className="font-medium text-white transition hover:text-[#2DA8FF]"
          >
            Servicios
          </a>

          <a
            href="/#como-funciona"
            className="font-medium text-white transition hover:text-[#2DA8FF]"
          >
            Cómo funciona
          </a>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 font-semibold text-white transition hover:border-red-300 hover:bg-red-500"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-[#1976FF] px-5 py-2.5 font-semibold text-white transition hover:bg-[#0f65e8]"
            >
              Iniciar sesión
            </Link>
          )}
        </div>

        {/* Botón del menú para celular */}
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 text-white transition hover:bg-white/20 md:hidden"
        >
          <span
            className={`h-0.5 w-5 bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
          />
          <span
            className={`h-0.5 w-5 bg-current transition ${menuOpen ? "opacity-0" : ""
              }`}
          />
          <span
            className={`h-0.5 w-5 bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
          />
        </button>
      </div>

      {/* Navegación desplegable para celular */}
      {menuOpen && (
        <div className="border-t border-white/15 bg-[#0B1F3A]/95 px-6 py-5 shadow-xl backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-base font-medium text-white transition hover:bg-white/10 hover:text-[#2DA8FF]"
            >
              Inicio
            </Link>

            <a
              href="/#nosotros"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-base font-medium text-white transition hover:bg-white/10 hover:text-[#2DA8FF]"
            >
              Nosotros
            </a>

            <a
              href="/#servicios"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-base font-medium text-white transition hover:bg-white/10 hover:text-[#2DA8FF]"
            >
              Servicios
            </a>

            <a
              href="/#como-funciona"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-base font-medium text-white transition hover:bg-white/10 hover:text-[#2DA8FF]"
            >
              Cómo funciona
            </a>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 rounded-lg border border-red-300/50 bg-red-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="mt-2 rounded-lg bg-[#1976FF] px-5 py-3 text-center text-base font-semibold text-white transition hover:bg-[#0f65e8]"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}