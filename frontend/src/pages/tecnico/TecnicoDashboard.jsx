import { Footer } from "../../components/Footer";

import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { Navbar } from "../../components/Navbar";
import SolicitudCard from "../../components/SolicitudCard";
import api from "../../services/api";
import tecnicoPerfil from "../../assets/imagenes/foto-tecnico.png";

export default function TecnicoDashboard() {
  const { user } = useAuth();

  const [availableRequests, setAvailableRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState(null);
  const [acceptError, setAcceptError] = useState("");

  const [myJobs, setMyJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectError, setRejectError] = useState("");
  const [requestToReject, setRequestToReject] = useState(null);

  const technicianName =
    user?.name || user?.nombre || "técnico";

  const technicianInitial = technicianName
    .trim()
    .charAt(0)
    .toUpperCase();

  const technicianImage =
    user?.imageUrl ||
    user?.imagen ||
    user?.avatar ||
    tecnicoPerfil;

  const technicianSpecialty =
    user?.specialty ||
    user?.especialidad ||
    user?.category ||
    "Técnico de UrbanFix";

  useEffect(() => {
    const loadAvailableRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/solicitudes/disponibles",
        );

        const requests =
          response.data?.solicitudes ??
          response.data?.data ??
          response.data;

        setAvailableRequests(
          Array.isArray(requests) ? requests : [],
        );
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            requestError.response?.data?.error ||
            "No se pudieron cargar las solicitudes disponibles.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAvailableRequests();
  }, []);

  useEffect(() => {
    const loadMyJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError("");

        const response = await api.get(
          "/solicitudes/mis-trabajos",
        );

        const jobs =
          response.data?.solicitudes ??
          response.data?.trabajos ??
          response.data?.data ??
          response.data;

        setMyJobs(Array.isArray(jobs) ? jobs : []);
      } catch (requestError) {
        setJobsError(
          requestError.response?.data?.message ||
            requestError.response?.data?.error ||
            "No se pudieron cargar tus trabajos.",
        );
      } finally {
        setJobsLoading(false);
      }
    };

    loadMyJobs();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      setAcceptingId(requestId);
      setAcceptError("");

      await api.patch(
        `/solicitudes/${requestId}/aceptar`,
      );

      setAvailableRequests((currentRequests) =>
        currentRequests.filter(
          (request) => request.id !== requestId,
        ),
      );

      const response = await api.get(
        "/solicitudes/mis-trabajos",
      );

      const jobs =
        response.data?.solicitudes ??
        response.data?.trabajos ??
        response.data?.data ??
        response.data;

      setMyJobs(Array.isArray(jobs) ? jobs : []);
    } catch (requestError) {
      setAcceptError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          "No se pudo aceptar la solicitud.",
      );
    } finally {
      setAcceptingId(null);
    }
  };

  const openRejectModal = (request) => {
    setRejectError("");
    setRequestToReject(request);
  };

  const closeRejectModal = () => {
    if (rejectingId !== null) return;

    setRejectError("");
    setRequestToReject(null);
  };

  const handleRejectRequest = async () => {
    if (!requestToReject) return;

    const requestId = requestToReject.id;

    try {
      setRejectingId(requestId);
      setRejectError("");

      await api.patch(
        `/solicitudes/${requestId}/rechazar`,
      );

      const response = await api.get(
        "/solicitudes/mis-trabajos",
      );

      const jobs =
        response.data?.solicitudes ??
        response.data?.trabajos ??
        response.data?.data ??
        response.data;

      setMyJobs(Array.isArray(jobs) ? jobs : []);
      setRequestToReject(null);
    } catch (requestError) {
      setRejectError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          "No se pudo rechazar la solicitud.",
      );
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#EAF4FC] via-[#F8FAFC] to-[#E8F8F4]">
      <Navbar />

      {/* Luces suaves para dar profundidad sin recargar el fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-28 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute -right-24 top-[32rem] h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        {/* Bienvenida breve */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-sky-300/40 bg-gradient-to-r from-[#0B1F3A] via-[#0B62B8] to-[#18A7C9] px-6 py-7 text-white shadow-xl shadow-blue-300/30 sm:px-8">
          <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-cyan-200/20 blur-2xl" />

          <div className="relative z-10">
            <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-base font-semibold backdrop-blur-sm">
              Panel del técnico
            </span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Hola, {technicianName} 👋
            </h1>

            <p className="mt-2 max-w-3xl text-base leading-7 text-blue-50 sm:text-lg">
              Revisá nuevas solicitudes y administrá los
              trabajos asignados a tu cuenta.
            </p>
          </div>
        </section>

        {/* Distribución principal inspirada en el diseño UX/UI */}
        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            {/* Resumen */}
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-white via-white to-amber-50 p-5 shadow-md shadow-amber-100/60 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="absolute inset-y-0 left-0 w-1.5 bg-amber-400" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-600">
                      Nuevas solicitudes
                    </p>
                    <p className="mt-1 text-4xl font-bold text-[#0B1F3A]">
                      {loading ? "..." : availableRequests.length}
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
                    🔧
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-white via-white to-blue-50 p-5 shadow-md shadow-blue-100/60 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="absolute inset-y-0 left-0 w-1.5 bg-[#1976FF]" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-600">
                      Mis trabajos
                    </p>
                    <p className="mt-1 text-4xl font-bold text-[#0B1F3A]">
                      {jobsLoading ? "..." : myJobs.length}
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                    🧰
                  </div>
                </div>
              </div>
            </section>

            {/* Solicitudes disponibles */}
            <section className="rounded-3xl border border-amber-100 bg-white/90 p-5 shadow-lg shadow-slate-200/70 backdrop-blur-sm sm:p-6">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <h2 className="text-3xl font-bold text-[#0B1F3A]">
                  Solicitudes de servicio
                </h2>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  Trabajos pendientes que todavía no tienen un
                  técnico asignado.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
                    Nuevas solicitudes
                  </span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                    {availableRequests.length} disponibles
                  </span>
                </div>
              </div>

              {loading && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-base text-slate-600">
                  Cargando solicitudes...
                </div>
              )}

              {!loading && error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-base font-medium text-red-700">
                  {error}
                </div>
              )}

              {acceptError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base font-medium text-red-700">
                  {acceptError}
                </div>
              )}

              {!loading &&
                !error &&
                availableRequests.length === 0 && (
                  <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-7 text-center">
                    <span className="text-4xl">🔧</span>
                    <h3 className="mt-3 text-xl font-bold text-[#0B1F3A]">
                      No hay solicitudes disponibles
                    </h3>
                    <p className="mt-2 text-base text-slate-600">
                      Cuando un cliente publique una nueva
                      solicitud, aparecerá aquí.
                    </p>
                  </div>
                )}

              {!loading &&
                !error &&
                availableRequests.length > 0 && (
                  <details
                    open
                    className="group overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 px-5 py-4 transition hover:from-amber-200 [&::-webkit-details-marker]:hidden">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-2xl text-white">
                          🔧
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#0B1F3A]">
                            Nuevas solicitudes
                          </h3>
                          <p className="mt-1 text-base text-slate-600">
                            Revisá los trabajos disponibles
                          </p>
                        </div>
                      </div>

                      <span className="text-xl text-amber-700 transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </summary>

                    <div className="grid gap-4 border-t border-amber-100 bg-amber-50/40 p-4 xl:grid-cols-2 [&>article]:p-5">
                      {availableRequests.map((request) => (
                        <SolicitudCard
                          key={request.id}
                          request={request}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleAcceptRequest(request.id)
                            }
                            disabled={acceptingId === request.id}
                            className="rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {acceptingId === request.id
                              ? "Aceptando..."
                              : "Aceptar solicitud"}
                          </button>
                        </SolicitudCard>
                      ))}
                    </div>
                  </details>
                )}
            </section>

            {/* Mis trabajos */}
            <section className="rounded-3xl border border-blue-100 bg-white/90 p-5 shadow-lg shadow-slate-200/70 backdrop-blur-sm sm:p-6">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <h2 className="text-3xl font-bold text-[#0B1F3A]">
                  Mis trabajos
                </h2>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  Solicitudes que aceptaste y están asignadas a
                  tu cuenta.
                </p>
              </div>

              {jobsLoading && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center text-base text-slate-600">
                  Cargando tus trabajos...
                </div>
              )}

              {!jobsLoading && jobsError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-base font-medium text-red-700">
                  {jobsError}
                </div>
              )}

              {!jobsLoading &&
                !jobsError &&
                myJobs.length === 0 && (
                  <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-7 text-center">
                    <span className="text-4xl">🧰</span>
                    <h3 className="mt-3 text-xl font-bold text-[#0B1F3A]">
                      Todavía no tenés trabajos asignados
                    </h3>
                    <p className="mt-2 text-base text-slate-600">
                      Las solicitudes que aceptes aparecerán aquí.
                    </p>
                  </div>
                )}

              {!jobsLoading &&
                !jobsError &&
                myJobs.length > 0 && (
                  <details
                    open
                    className="group overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between bg-gradient-to-r from-blue-100 via-sky-50 to-cyan-100 px-5 py-4 transition hover:from-blue-200 [&::-webkit-details-marker]:hidden">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1976FF] text-2xl text-white">
                          🧰
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#0B1F3A]">
                            Trabajos asignados
                          </h3>
                          <p className="mt-1 text-base text-slate-600">
                            Revisá los servicios que aceptaste
                          </p>
                        </div>
                      </div>

                      <span className="text-xl text-[#1976FF] transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </summary>

                    <div className="grid gap-4 border-t border-blue-100 bg-blue-50/50 p-4 xl:grid-cols-2 [&>article]:p-5">
                      {myJobs.map((job) => {
                        const jobStatus = String(
                          job.status || job.estado || "",
                        )
                          .trim()
                          .toUpperCase()
                          .replace(/\s+/g, "_");

                        return (
                          <SolicitudCard
                            key={job.id}
                            request={job}
                          >
                            {jobStatus === "ACEPTADA" && (
                              <button
                                type="button"
                                onClick={() =>
                                  openRejectModal(job)
                                }
                                className="rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-base font-semibold text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-600 hover:text-white"
                              >
                                Rechazar solicitud
                              </button>
                            )}
                          </SolicitudCard>
                        );
                      })}
                    </div>
                  </details>
                )}
            </section>
          </div>

          {/* Columna lateral del perfil */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="relative isolate overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-br from-white via-blue-50 to-cyan-100 shadow-xl shadow-blue-200/50">
              <div className="absolute -right-16 top-16 h-44 w-44 rounded-full bg-cyan-300/20 blur-2xl" />
              <div className="absolute -left-16 bottom-16 h-40 w-40 rounded-full bg-blue-300/20 blur-2xl" />

              <div className="relative z-10 h-4 bg-gradient-to-r from-[#0B1F3A] via-[#1976FF] to-[#18A7C9]" />

              <div className="relative z-10 p-6 text-center">
                <h2 className="text-2xl font-bold text-[#0B1F3A]">
                  Mi perfil profesional
                </h2>

                <div className="mx-auto mt-5 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-[6px] border-white bg-gradient-to-br from-blue-600 to-cyan-500 text-5xl font-bold text-white shadow-[0_12px_30px_rgba(25,118,255,0.25)] sm:h-48 sm:w-48 sm:text-6xl">
                  {technicianImage ? (
                    <img
                      src={technicianImage}
                      alt={`Perfil de ${technicianName}`}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    technicianInitial
                  )}
                </div>

                <h3 className="mt-4 text-2xl font-bold text-[#0B1F3A]">
                  {technicianName}
                </h3>

                <div className="mt-2">
                  <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-base font-semibold text-blue-800">
                    {technicianSpecialty}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                    <span>✓</span> Perfil de técnico
                  </span>
                </div>

                <div className="mt-5 space-y-3 rounded-2xl border border-white/80 bg-white/80 p-4 text-left text-base text-slate-600 shadow-sm backdrop-blur-sm">
                  {user?.email && (
                    <p className="break-all">
                      <span className="font-semibold text-slate-800">
                        Correo:
                      </span>{" "}
                      {user.email}
                    </p>
                  )}

                  {(user?.phone || user?.telefono) && (
                    <p>
                      <span className="font-semibold text-slate-800">
                        Teléfono:
                      </span>{" "}
                      {user.phone || user.telefono}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-sky-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-5 shadow-md">
              <h2 className="text-xl font-bold text-[#0B1F3A]">
                Resumen de actividad
              </h2>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                  <span className="text-base text-slate-600">
                    Disponibles
                  </span>
                  <span className="text-lg font-bold text-amber-700">
                    {loading ? "..." : availableRequests.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                  <span className="text-base text-slate-600">
                    Trabajos asignados
                  </span>
                  <span className="text-lg font-bold text-blue-700">
                    {jobsLoading ? "..." : myJobs.length}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-[#0B1F3A] p-5 text-white shadow-lg">
              <p className="text-lg font-bold">
                Tu trabajo hace la diferencia
              </p>
              <p className="mt-2 text-base leading-6 text-blue-100">
                Revisá las solicitudes y mantené actualizados tus
                servicios desde este panel.
              </p>
            </section>
          </aside>
        </div>
      </main>
      <Footer />

      {/* Modal de confirmación para rechazar */}
      {requestToReject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
          <button
            type="button"
            aria-label="Cerrar confirmación"
            onClick={closeRejectModal}
            className="absolute inset-0 h-full w-full bg-[#071D36]/65 backdrop-blur-sm"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-modal-title"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-red-100 bg-white shadow-2xl"
          >
            <div className="h-2 bg-gradient-to-r from-red-500 via-rose-500 to-orange-400" />

            <div className="p-6 text-center sm:p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-3xl shadow-inner">
                ✕
              </div>

              <h2
                id="reject-modal-title"
                className="mt-5 text-2xl font-bold text-[#0B1F3A]"
              >
                ¿Rechazar esta solicitud?
              </h2>

              <p className="mt-3 text-base leading-7 text-slate-600">
                El trabajo
                <span className="font-semibold text-slate-800">
                  {" "}
                  “{requestToReject.title ||
                    requestToReject.titulo ||
                    "Servicio solicitado"}”
                </span>{" "}
                cambiará su estado a rechazado y el cliente podrá
                verlo en su panel.
              </p>

              {rejectError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-700">
                  {rejectError}
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={closeRejectModal}
                  disabled={rejectingId !== null}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Volver
                </button>

                <button
                  type="button"
                  onClick={handleRejectRequest}
                  disabled={rejectingId !== null}
                  className="rounded-xl bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {rejectingId !== null
                    ? "Rechazando..."
                    : "Sí, rechazar"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
      
    </div>
    
  );
}