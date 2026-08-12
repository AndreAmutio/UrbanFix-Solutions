import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { Navbar } from "../../components/Navbar";
import SolicitudCard from "../../components/SolicitudCard";
import api from "../../services/api";

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

  const technicianName =
    user?.name || user?.nombre || "técnico";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Encabezado */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B1F3A] via-[#123E73] to-[#1976FF] px-6 py-8 text-white shadow-lg sm:px-9 sm:py-10">
          <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
            Panel del técnico
          </span>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Hola, {technicianName} 👋
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
            Administrá tus trabajos y revisá las nuevas
            solicitudes de servicio disponibles.
          </p>
        </section>

        {/* Contadores */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Mis trabajos
              </p>

              <p className="mt-1 text-3xl font-bold text-[#0B1F3A]">
                {jobsLoading ? "..." : myJobs.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Solicitudes asignadas
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
              🧰
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Disponibles
              </p>

              <p className="mt-1 text-3xl font-bold text-[#0B1F3A]">
                {loading ? "..." : availableRequests.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Solicitudes pendientes
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
              🔧
            </div>
          </div>
        </section>

        {/* Mis trabajos */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#0B1F3A]">
              Mis trabajos
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Solicitudes que aceptaste y están asignadas a
              tu cuenta.
            </p>
          </div>

          {jobsLoading && (
            <div className="rounded-2xl border border-blue-200 bg-white p-6 text-center text-slate-500 shadow-sm">
              Cargando tus trabajos...
            </div>
          )}

          {!jobsLoading && jobsError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
              {jobsError}
            </div>
          )}

          {!jobsLoading &&
            !jobsError &&
            myJobs.length === 0 && (
              <div className="rounded-2xl border border-blue-200 bg-white p-6 text-center shadow-sm">
                <span className="text-4xl">🧰</span>

                <h3 className="mt-3 text-lg font-bold text-[#0B1F3A]">
                  Todavía no tenés trabajos asignados
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Las solicitudes que aceptes aparecerán aquí.
                </p>
              </div>
            )}

          {!jobsLoading &&
            !jobsError &&
            myJobs.length > 0 && (
              <details className="group overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                      🧰
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#0B1F3A]">
                        Trabajos asignados
                      </h3>

                      <p className="text-sm text-slate-500">
                        Tocá para ver todos tus trabajos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700 sm:inline">
                      {myJobs.length}
                    </span>

                    <span className="text-xl text-[#1976FF] transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </div>
                </summary>

                <div className="grid gap-3 border-t border-blue-100 bg-slate-50/80 p-3 sm:p-4 xl:grid-cols-2 [&>article]:p-4">
                  {myJobs.map((job) => (
                    <SolicitudCard
                      key={job.id}
                      request={job}
                    />
                  ))}
                </div>
              </details>
            )}
        </section>

        {/* Solicitudes disponibles */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#0B1F3A]">
              Solicitudes disponibles
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Trabajos pendientes que todavía no tienen un
              técnico asignado.
            </p>
          </div>

          {loading && (
            <div className="rounded-2xl border border-amber-200 bg-white p-6 text-center text-slate-500 shadow-sm">
              Cargando solicitudes...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {acceptError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {acceptError}
            </div>
          )}

          {!loading &&
            !error &&
            availableRequests.length === 0 && (
              <div className="rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm">
                <span className="text-4xl">🔧</span>

                <h3 className="mt-3 text-lg font-bold text-[#0B1F3A]">
                  No hay solicitudes disponibles
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Cuando un cliente publique una nueva solicitud,
                  aparecerá aquí.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            availableRequests.length > 0 && (
              <details className="group overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-2xl">
                      🔧
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#0B1F3A]">
                        Nuevas solicitudes
                      </h3>

                      <p className="text-sm text-slate-500">
                        Tocá para revisar los trabajos disponibles
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700 sm:inline">
                      {availableRequests.length}
                    </span>

                    <span className="text-xl text-amber-600 transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </div>
                </summary>

                <div className="grid gap-3 border-t border-amber-100 bg-slate-50/80 p-3 sm:p-4 xl:grid-cols-2 [&>article]:p-4">
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
                        className="rounded-xl bg-[#1976FF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f65e8] disabled:cursor-not-allowed disabled:opacity-60"
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
      </main>
    </div>
  );
}