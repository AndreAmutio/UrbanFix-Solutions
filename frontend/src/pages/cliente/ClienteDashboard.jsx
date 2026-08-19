import { ProfileSection } from "./ProfileSection";

import { Footer } from "../../components/Footer";
import SolicitudCard from "../../components/SolicitudCard";
import { RequestForm } from "./RequestForm";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { ServiceCategoryCard } from "../../pages/cliente/ServiceCategoryCard";

import avatarCliente from "../../assets/imagenes/perfil-usuario-femenino.png";
import electricidadIcon from "../../assets/iconos/electricidad.PNG";
import informaticaIcon from "../../assets/iconos/informatica.PNG";
import plomeriaIcon from "../../assets/iconos/plomeria.PNG";

const services = [
  {
    name: "Electricidad",
    category: "ELECTRICIDAD",
    description: "Instalaciones, reparaciones y problemas eléctricos.",
    price: "Desde $50.000",
    image: electricidadIcon,
  },
  {
    name: "Plomería",
    category: "PLOMERIA",
    description: "Pérdidas, cañerías, grifería e instalaciones.",
    price: "Desde $28.000",
    image: plomeriaIcon,
  },
  {
    name: "Informática",
    category: "INFORMATICA",
    description: "Equipos, redes, instalación y soporte técnico.",
    price: "Desde $42.000",
    image: informaticaIcon,
  },
  {
    name: "Gasista",
    category: "GASISTAS",
    description: "Revisión, reparación e instalación de artefactos.",
    price: "Desde $35.000",
    icon: "🔥",
  },
];

const upcomingOptions = [
  {
    icon: "📍",
    title: "Direcciones guardadas",
    description: "Guardá diferentes domicilios para futuras solicitudes.",
  },
  {
    icon: "💳",
    title: "Métodos de pago",
    description: "Administrá tus medios de pago desde tu cuenta.",
  },
  {
    icon: "🔔",
    title: "Notificaciones",
    description: "Elegí cómo recibir novedades sobre tus solicitudes.",
  },
];

export default function ClienteDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  

  const loadRequests = async () => {
    setLoadingRequests(true);
    setRequestsError("");

    try {
      const response = await api.get("/solicitudes/mias");
      const requestList =
        response.data?.solicitudes ??
        response.data?.data ??
        response.data;
        
        console.log("Solicitudes recibidas:", requestList);

      setRequests(Array.isArray(requestList) ? requestList : []);
    } catch (error) {
      setRequestsError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "No se pudieron cargar las solicitudes.",
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const requestCounts = requests.reduce(
    (counts, request) => {
      const status = (request.status || request.estado || "")
        .trim()
        .toUpperCase();

      if (status === "PENDIENTE") {
        counts.pending += 1;
      }
      if (status === "ACEPTADA" || status === "EN_PROGRESO") {
        counts.inProgress += 1;
      }
      if (status === "COMPLETADA") {
        counts.completed += 1;
      }
      return counts;
    },
    {
      pending: 0,
      inProgress: 0,
      completed: 0,
    },
  );

  const firstName = user?.name?.split(" ")[0] || "cliente";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);

    document
      .getElementById("nueva-solicitud")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSection = (sectionId) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => scrollToSection("inicio")}
            className="text-2xl font-extrabold text-[#0B1F3A]"
          >
            Urban<span className="text-[#1976FF]">Fix</span>
          </button>

          <nav className="hidden items-center gap-7 md:flex">
            <button
              type="button"
              onClick={() => scrollToSection("inicio")}
              className="font-medium text-slate-600 transition hover:text-[#1976FF]"
            >
              Inicio
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("servicios")}
              className="font-medium text-slate-600 transition hover:text-[#1976FF]"
            >
              Pedir servicio
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("mis-solicitudes")}
              className="font-medium text-slate-600 transition hover:text-[#1976FF]"
            >
              Mis solicitudes
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled
              title="Notificaciones: próximamente"
              className="relative hidden h-10 w-10 cursor-not-allowed items-center justify-center rounded-full bg-slate-100 text-lg opacity-70 sm:flex"
            >
              🔔
            </button>

            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 transition hover:border-blue-300"
            >
              <img
                src={user?.imageUrl || avatarCliente}
                alt="Perfil"
                className="h-12 w-12 rounded-full object-cover"
              />

              <span className="hidden text-sm font-semibold text-[#0B1F3A] sm:block">
                {firstName}
              </span>
            </button>
          </div>
        </div>
      </header>

      <section
        id="inicio"
        className="bg-gradient-to-br from-[#07172d] via-[#0B1F3A] to-[#123f70]"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 text-white sm:px-8 lg:grid-cols-[1fr_360px] lg:items-center lg:py-16">
          <div>
            <span className="inline-flex rounded-full bg-blue-400/15 px-4 py-2 text-sm font-semibold text-blue-200">
              Panel del cliente
            </span>
            <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl"> Hola, {firstName}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Encontrá profesionales, solicitá un servicio y seguí cada
              trabajo desde un solo lugar.
            </p>

            <button
              type="button"
              onClick={() => scrollToSection("servicios")}
              className="mt-7 rounded-xl bg-[#1976FF] px-6 py-3 font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-[#0f65e8]"
            >
              + Pedir un servicio
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
              <p className="text-3xl font-extrabold"> {requestCounts.pending} </p>
              <p className="mt-1 text-xs text-slate-300">Pendientes</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
              <p className="text-3xl font-extrabold"> {requestCounts.inProgress} </p>
              <p className="mt-1 text-xs text-slate-300"> En curso </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
              <p className="text-3xl font-extrabold"> {requestCounts.completed} </p>
              <p className="mt-1 text-xs text-slate-300">Finalizadas </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-5 py-10 sm:px-8">
        <section id="servicios">
          <div>
            <p className="font-semibold text-[#1976FF]"> Servicios disponibles</p>
            <h2 className="mt-1 text-3xl font-extrabold text-[#0B1F3A]"> ¿Qué necesitás solucionar? </h2>
            <p className="mt-2 text-slate-500"> Elegí una categoría para comenzar tu solicitud. </p>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCategoryCard
                key={service.category}
                {...service}
                onClick={() =>
                  handleSelectCategory(service.category)} />
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            * Los valores son ilustrativos para el prototipo. El precio
            definitivo deberá coordinarse con el técnico.
          </p>
        </section>

        <section
          id="nueva-solicitud"
          className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-[#1976FF]"> Nueva solicitud </p>
              <h2 className="mt-1 text-2xl font-extrabold text-[#0B1F3A]">
                Contanos qué trabajo necesitás
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                El formulario utilizará los campos admitidos por el backend.
              </p>
            </div>
            {selectedCategory && (
              <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                {
                  services.find(
                    (service) =>
                      service.category === selectedCategory,
                  )?.name
                }
              </span>
            )}
          </div>
          <RequestForm selectedCategory={selectedCategory} onCreated={loadRequests} />
        </section>

        <section
          id="mis-solicitudes"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-semibold text-[#1976FF]">
                Historial de servicios
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-[#0B1F3A]">
                Mis solicitudes
              </h2>

              <p className="mt-2 text-slate-500">
                Seguí el estado de los servicios que solicitaste.
              </p>
            </div>

            {!loadingRequests && !requestsError && requests.length > 0 && (
              <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-[#1976FF]">
                {requests.length}{" "}
                {requests.length === 1 ? "solicitud" : "solicitudes"}
              </span>
            )}
          </div>

          {loadingRequests ? (
            <div className="mt-7 rounded-2xl bg-slate-50 p-8 text-center text-slate-500">
              Cargando solicitudes...
            </div>
          ) : requestsError ? (
            <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
              {requestsError}
            </div>
          ) : requests.length === 0 ? (
            <div className="mt-7 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 text-center">
              <span className="text-5xl">🛠️</span>

              <h3 className="mt-4 text-lg font-bold text-[#0B1F3A]">
                Todavía no tenés solicitudes
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Cuando crees una solicitud aparecerá acá con su categoría,
                fecha, técnico asignado y estado.
              </p>

              <button
                type="button"
                onClick={() => scrollToSection("servicios")}
                className="mt-5 font-semibold text-[#1976FF] hover:underline"
              >
                Solicitar mi primer servicio
              </button>
            </div>
          ) : (
            <div className="mt-7 grid items-start gap-5 lg:grid-cols-2">
              {requests.map((request) => (
                <SolicitudCard
                  key={request.id}
                  request={request}
                  collapsible
                />
              ))}
            </div>
          )}
        </section>

      </div>
      <Footer />
      {isProfileOpen && (
        <ProfileSection
          profile={user}
          onLogout={handleLogout}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </main>
  );
}