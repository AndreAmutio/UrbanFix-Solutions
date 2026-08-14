import { Link } from "react-router-dom";

import logoCompleto from "../assets/logos/logo-completo.png";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-auto overflow-hidden bg-gradient-to-r from-[#287B96] via-[#0B3554] to-[#061426]">

            {/* Luces integradas al fondo */}
            <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-200/20 blur-3xl" />      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />

            {/* Franja de identidad */}
            <div className="relative h-2 bg-gradient-to-r from-amber-400 via-[#1976FF] to-emerald-500" />

            <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-12 md:grid-cols-[1.3fr_0.7fr_1fr] lg:px-12">
                {/* Marca */}
                <div className="text-left lg:-ml-16 xl:-ml-20">
                    <div className="flex h-44 w-80 items-center justify-start overflow-visible">
                        <img
                            src={logoCompleto}
                            alt="UrbanFix Solutions"
                            className="h-44 w-44 shrink-0 scale-[1.5] object-contain"
                        />
                    </div>

                    <p className="mt-2 max-w-md text-left text-base leading-7 text-blue-100">
                        Conectamos personas que necesitan soluciones para su hogar con
                        técnicos preparados para ayudarlas.
                    </p>
                </div>
                {/* Navegación */}
                <div>
                    <h3 className="text-xl font-extrabold text-white">
                        Navegación
                    </h3>

                    <span className="mt-2 block h-1 w-12 rounded-full bg-[#2DA8FF]" />

                    <nav className="mt-6 flex flex-col items-start gap-4">
                        <Link
                            to="/"
                            className="font-medium text-blue-100 transition hover:translate-x-1 hover:text-white"
                        >
                            Inicio
                        </Link>

                        <a
                            href="/#nosotros"
                            className="font-medium text-blue-100 transition hover:translate-x-1 hover:text-white"
                        >
                            Nosotros
                        </a>

                        <a
                            href="/#servicios"
                            className="font-medium text-blue-100 transition hover:translate-x-1 hover:text-white"
                        >
                            Servicios
                        </a>

                        <a
                            href="/#como-funciona"
                            className="font-medium text-blue-100 transition hover:translate-x-1 hover:text-white"
                        >
                            Cómo funciona
                        </a>
                    </nav>
                </div>

                {/* Soluciones */}
                <div>
                    <h3 className="text-xl font-extrabold text-white">
                        Soluciones
                    </h3>

                    <span className="mt-2 block h-1 w-12 rounded-full bg-emerald-400" />

                    <div className="mt-6 flex max-w-md flex-wrap gap-3">
                        <span className="rounded-full border border-amber-300/40 bg-amber-400/15 px-4 py-2 text-sm font-bold text-amber-100">
                            ⚡ Electricidad
                        </span>

                        <span className="rounded-full border border-blue-300/40 bg-blue-400/15 px-4 py-2 text-sm font-bold text-blue-100">
                            💧 Plomería
                        </span>

                        <span className="rounded-full border border-emerald-300/40 bg-emerald-400/15 px-4 py-2 text-sm font-bold text-emerald-100">
                            💻 Informática
                        </span>

                        <span className="rounded-full border border-orange-300/40 bg-orange-400/15 px-4 py-2 text-sm font-bold text-orange-100">
                            🔥 Gasista
                        </span>
                    </div>

                    <p className="mt-7 max-w-sm text-sm leading-6 text-blue-100">
                        Una plataforma simple para solicitar, gestionar y resolver
                        servicios.
                    </p>
                </div>
            </div>

            {/* Cierre inferior */}
            <div className="relative border-t border-white/10 bg-[#030D1B]/55">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-sm text-blue-100 sm:flex-row sm:items-center sm:justify-between lg:px-12">
                    <p>© {currentYear} UrbanFix Solutions.</p>

                    <p>Servicios para tu hogar, en un solo lugar.</p>
                </div>
            </div>
        </footer>
    );
}