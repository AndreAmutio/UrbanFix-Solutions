import { Footer } from "../../components/Footer";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar";

import imagenPortada from "../../assets/imagenes/2.jpeg";
import imagenNosotros from "../../assets/imagenes/nosotros.jpeg";

import electricidad from "../../assets/iconos/electricidad.PNG";
import plomeria from "../../assets/iconos/plomeria.PNG";
import informatica from "../../assets/iconos/informatica.PNG";

const servicios = [
  {
    nombre: "Electricidad",
    icono: electricidad,
    descripcion:
      "Instalaciones eléctricas, mantenimiento, reparación de fallas, iluminación, tomacorrientes e interruptores.",
  },
  {
    nombre: "Plomería",
    icono: plomeria,
    descripcion:
      "Reparación de pérdidas, destape de cañerías, instalación de griferías, sanitarios y mantenimiento.",
  },
  {
    nombre: "Informática",
    icono: informatica,
    descripcion:
      "Soporte técnico, configuración de computadoras, redes, impresoras y mantenimiento de equipos.",
  },
  {
    nombre: "Gas",
    simbolo: "🔥",
    descripcion:
      "Instalación, mantenimiento y revisión de sistemas y artefactos de gas por profesionales capacitados.",
  },
];

const testimonios = [
  {
    nombre: "Cliente particular",
    comentario:
      "Encontré rápidamente un profesional y pude coordinar el servicio de manera sencilla.",
    calificacion: 5,
  },
  {
    nombre: "Comercio local",
    comentario:
      "El técnico fue puntual, explicó el trabajo y resolvió el problema correctamente.",
    calificacion: 5,
  },
  {
    nombre: "Usuario de UrbanFix",
    comentario:
      "La plataforma es clara y permite solicitar ayuda sin perder tiempo buscando contactos.",
    calificacion: 4,
  },
];

function Landing() {
  return (
    <main className="min-h-screen bg-white text-[#0B1F3A]">
      {/* Portada */}
      <section
        id="inicio"
        className="relative flex min-h-screen bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${imagenPortada})` }}
      >
        <div className="absolute inset-0 bg-[#0B1F3A]/70" />

        <Navbar />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-6 pb-16 pt-28 lg:px-10">
          <div className="max-w-2xl">
            <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-[#2DA8FF]">
              Servicios para tu hogar
            </p>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Encontrá al técnico ideal para cada necesidad
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-200 sm:text-lg">
              Conectamos clientes con técnicos de confianza para resolver
              servicios de electricidad, plomería, informática y mucho más.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register?role=CLIENTE"
                className="rounded-lg bg-[#1976FF] px-6 py-3 text-center font-semibold transition hover:bg-[#0f65e8]"
              >
                Solicitar servicio
              </Link>

              <Link
                to="/register?role=TECNICO"
                className="rounded-lg border border-white px-6 py-3 text-center font-semibold transition hover:bg-white hover:text-[#0B1F3A]"
              >
                Soy técnico
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-semibold uppercase tracking-[0.2em] text-[#1976FF]">
              Sobre nosotros
            </p>

            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Soluciones profesionales para tu hogar y tu negocio
            </h2>

            <p className="mt-6 leading-7 text-gray-600">
              UrbanFix Solutions conecta personas que necesitan resolver un
              problema con técnicos capacitados para realizar el trabajo de
              forma eficiente, segura y confiable.
            </p>

            <h3 className="mt-8 text-xl font-bold">
              ¿Por qué elegir UrbanFix?
            </h3>

            <ul className="mt-4 space-y-3 text-gray-600">
              <li>✓ Técnicos especializados y capacitados.</li>
              <li>✓ Atención rápida y profesional.</li>
              <li>✓ Presupuestos claros y sin compromiso.</li>
              <li>✓ Servicios para hogares, comercios y oficinas.</li>
              <li>✓ Compromiso con la seguridad y la calidad.</li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-xl">
            <img
              src={imagenNosotros}
              alt="Equipo de técnicos de UrbanFix"
              className="h-full min-h-80 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="bg-[#F5F7FA] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-[#1976FF]">
              Profesionales a tu alcance
            </p>

            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Nuestros servicios
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Encontrá técnicos preparados para resolver las necesidades de tu
              hogar, comercio u oficina.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {servicios.map((servicio) => (
              <article
                key={servicio.nombre}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-blue-50">
                  {servicio.icono ? (
                    <img
                      src={servicio.icono}
                      alt={`Ícono de ${servicio.nombre}`}
                      className="h-20 w-20 scale-[2] object-contain"
                    />
                  ) : (
                      <span className="text-5xl" aria-hidden="true">
                        {servicio.simbolo}
                      </span>
                  )}
                </div>

                <h3 className="mt-5 text-xl font-bold">{servicio.nombre}</h3>

                <p className="mt-3 leading-6 text-gray-600">
                  {servicio.descripcion}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-[#1976FF]">
              Simple y rápido
            </p>

            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              ¿Cómo funciona?
            </h2>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              ["1", "Elegí tu servicio", "Contanos qué necesitás solucionar."],
              [
                "2",
                "Seleccioná un profesional",
                "Elegí al técnico que mejor se adapte a tu necesidad.",
              ],
              [
                "3",
                "Recibí el servicio",
                "Coordiná el trabajo y resolvé el problema.",
              ],
            ].map(([numero, titulo, descripcion]) => (
              <article key={numero} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1976FF] text-2xl font-bold text-white">
                  {numero}
                </div>

                <h3 className="mt-5 text-lg font-bold">{titulo}</h3>
                <p className="mt-2 text-gray-600">{descripcion}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-[#F5F7FA] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-[#1976FF]">
              Experiencias
            </p>

            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Clientes satisfechos
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonios.map((testimonio) => (
              <article
                key={testimonio.nombre}
                className="rounded-2xl bg-white p-7 shadow-sm"
              >
                <div
                  className="text-xl tracking-wider text-[#F59E0B]"
                  aria-label={`${testimonio.calificacion} de 5 estrellas`}
                >
                  {"★".repeat(testimonio.calificacion)}
                  <span className="text-gray-300">
                    {"★".repeat(5 - testimonio.calificacion)}
                  </span>
                </div>

                <p className="mt-5 leading-7 text-gray-600">
                  “{testimonio.comentario}”
                </p>

                <p className="mt-5 font-bold text-[#0B1F3A]">
                  {testimonio.nombre}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
     <Footer />
    </main>
    
  );
}

export default Landing;
