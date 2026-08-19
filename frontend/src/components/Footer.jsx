import { Link } from "react-router-dom";

import logoCompleto from "../assets/logos/logo-completo.png";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto bg-[#29445E]">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-[1.3fr_0.7fr_1fr] lg:px-12">
                {/* Marca */}
                <div className="text-left lg:-ml-16 xl:-ml-20">
                    <div className="flex h-40 w-[28rem] items-center">
                        <img
                            src={logoCompleto}
                            alt="UrbanFix Solutions"
                            className="h-80 w-auto max-w-none object-contain object-left"
                        />
                    </div>

                    <p className="-mt-2 max-w-xl text-lg leading-8 text-slate-200">
                        Conectamos personas que necesitan soluciones 
                        <br/>para su hogar con
                        técnicos preparados para ayudarlas.
                    </p>
                </div>

                {/* Navegación */}
                <div>
                    <h3 className="text-xl font-bold text-white">
                        Navegación
                    </h3>
                    <div className="mt-3 h-px w-10 bg-[#2DA8FF]" />
                    <nav className="mt-6 flex flex-col items-start gap-4">
                        <Link
                            to="/"
                            className="text-slate-200 transition hover:text-white"> Inicio </Link>
                        <a href="/#nosotros" className="text-slate-200 transition hover:text-white"> Nosotros </a>
                        <a href="/#servicios" className="text-slate-200 transition hover:text-white"> Servicios </a>
                        <a href="/#como-funciona" className="text-slate-200 transition hover:text-white">Cómo funciona </a>
                    </nav>
                </div>

                {/* Soluciones */}
                <div>
                    <h3 className="text-xl font-bold text-white">
                        Soluciones
                    </h3>
                    <div className="mt-3 h-px w-10 bg-[#2DA8FF]" />
                    <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-slate-200">
                        <span>⚡ Electricidad</span>
                        <span>💧 Plomería</span>
                        <span>💻 Informática</span>
                        <span>🔥 Gasista</span>
                    </div>

                    <p className="mt-8 max-w-sm text-sm leading-6 text-slate-200">
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