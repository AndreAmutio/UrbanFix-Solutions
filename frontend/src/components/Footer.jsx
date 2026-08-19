import { Link } from "react-router-dom";

import logoCompleto from "../assets/logos/logo-completo.png";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto bg-[#29445E]">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-[1.3fr_0.7fr_1fr] lg:gap-12 lg:px-12">

                {/* Marca */}
                <div className="text-left lg:-ml-16 xl:-ml-20">
                    <div className="flex h-40 w-[28rem] items-center">
                        <img
                            src={logoCompleto}
                            alt="UrbanFix Solutions"
                            className="h-80 w-auto max-w-none object-contain object-left"
                        />
                    </div>

                    <p className="-mt-2 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
                        Conectamos personas que necesitan soluciones para su hogar con
                        técnicos preparados para ayudarlas.
                    </p>
                </div>

                {/* Navegación */}
                <div>
                    <h3 className="text-xl font-bold text-white"> Navegación </h3>
                    <div className="mt-3 h-px w-10 bg-[#2DA8FF]" />
                    <nav className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 md:flex md:flex-col md:gap-3">
                        <Link
                            to="/"
                            className="text-slate-200 transition hover:text-white"> Inicio </Link>
                        <a
                            href="/#nosotros"
                            className="text-slate-200 transition hover:text-white">Nosotros </a>
                        <a
                            href="/#servicios"
                            className="text-slate-200 transition hover:text-white"> Servicios </a>
                        <a
                            href="/#como-funciona"
                            className="text-slate-200 transition hover:text-white">Cómo funciona </a>
                    </nav>
                </div>

                {/* Soluciones */}
                <div>
                    <h3 className="text-xl font-bold text-white">
                        Soluciones
                    </h3>
                    <div className="mt-3 h-px w-10 bg-[#2DA8FF]" />

                    <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-slate-200 sm:gap-x-6 sm:gap-y-4">
                        <span>⚡ Electricidad</span>
                        <span>💧 Plomería</span>
                        <span>💻 Informática</span>
                        <span>🔥 Gasista</span>
                    </div>
                    <p className="mt-6 max-w-sm text-sm leading-6 text-slate-200">
                        Una plataforma simple para solicitar, gestionar y resolver
                        servicios.
                    </p>
                </div>
            </div>

            {/* Cierre inferior */}
            <div className="border-t border-white/10 bg-[#21384D]">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between lg:px-12">
                    <p>© {currentYear} UrbanFix Solutions.</p>

                    <p>Servicios para tu hogar, en un solo lugar.</p>
                </div>
            </div>
        </footer>
    );
}