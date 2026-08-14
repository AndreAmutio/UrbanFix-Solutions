import { Footer } from "../../components/Footer";

import adminPerfil from "../../assets/imagenes/perfil-administrador.png";
import { useEffect, useMemo, useState } from "react";

import { Navbar } from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const statusOptions = [
  "PENDIENTE",
  "ACEPTADA",
  "EN_PROGRESO",
  "COMPLETADA",
  "RECHAZADA",
  "CANCELADA",
];

const statusConfig = {
  PENDIENTE: {
    label: "Pendiente",
    badge: "border-amber-200 bg-amber-100 text-amber-800",
    dot: "bg-amber-400",
  },
  ACEPTADA: {
    label: "Aceptada",
    badge: "border-blue-200 bg-blue-100 text-blue-800",
    dot: "bg-blue-500",
  },
  EN_PROGRESO: {
    label: "En progreso",
    badge: "border-violet-200 bg-violet-100 text-violet-800",
    dot: "bg-violet-500",
  },
  COMPLETADA: {
    label: "Completada",
    badge: "border-emerald-200 bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-500",
  },
  RECHAZADA: {
    label: "Rechazada",
    badge: "border-rose-200 bg-rose-100 text-rose-800",
    dot: "bg-rose-500",
  },
  CANCELADA: {
    label: "Cancelada",
    badge: "border-slate-200 bg-slate-200 text-slate-700",
    dot: "bg-slate-500",
  },
};

const roleConfig = {
  ADMIN: {
    label: "Administrador",
    styles: "border-violet-200 bg-violet-100 text-violet-800",
  },
  TECNICO: {
    label: "Técnico",
    styles: "border-cyan-200 bg-cyan-100 text-cyan-800",
  },
  CLIENTE: {
    label: "Cliente",
    styles: "border-blue-200 bg-blue-100 text-blue-800",
  },
};

const normalizeValue = (value = "") =>
  String(value).trim().toUpperCase().replace(/\s+/g, "_");

const getStatus = (request) =>
  normalizeValue(request?.status || request?.estado || "PENDIENTE");

const getRole = (user) =>
  normalizeValue(user?.role || user?.rol || "CLIENTE");

const getId = (item) =>
  item?.id ?? item?._id ?? item?.solicitudId ?? item?.usuarioId;

const getPersonName = (person, fallback = "Sin asignar") => {
  if (!person) return fallback;
  if (typeof person === "string") return person;

  return (
    person.name ||
    person.nombre ||
    person.fullName ||
    person.nombreCompleto ||
    person.email ||
    fallback
  );
};

const getUserName = (user) =>
  getPersonName(user, "Usuario sin nombre");

const getClientName = (request) =>
  getPersonName(
    request?.client ||
    request?.cliente ||
    request?.user ||
    request?.usuario ||
    request?.clientName ||
    request?.clienteNombre,
    "Cliente sin informar",
  );

const getTechnicianName = (request) =>
  getPersonName(
    request?.technician ||
    request?.tecnico ||
    request?.assignedTechnician ||
    request?.tecnicoAsignado ||
    request?.technicianName ||
    request?.tecnicoNombre,
  );

const getCategory = (request) =>
  request?.category ||
  request?.categoria ||
  request?.serviceType ||
  request?.tipoServicio ||
  "Servicio general";

const getRequestTitle = (request) =>
  request?.title ||
  request?.titulo ||
  request?.service ||
  request?.servicio ||
  getCategory(request);

const getDate = (request) =>
  request?.scheduledDate ||
  request?.fechaProgramada ||
  request?.createdAt ||
  request?.fechaCreacion ||
  request?.date ||
  request?.fecha;

const formatDate = (date) => {
  if (!date) return "Sin fecha";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return String(date);

  return parsedDate.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const extractList = (response, possibleKeys) => {
  const responseData = response?.data;
  if (Array.isArray(responseData)) return responseData;

  for (const key of possibleKeys) {
    if (Array.isArray(responseData?.[key])) return responseData[key];
    if (Array.isArray(responseData?.data?.[key])) {
      return responseData.data[key];
    }
  }

  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
};

const getApiError = (requestError, fallback) =>
  requestError.response?.data?.message ||
  requestError.response?.data?.error ||
  fallback;

function StatCard({ label, value, icon, accent, surface, shadow }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl ${surface} ${shadow}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 ${accent}`} />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-base font-bold text-slate-600">{label}</p>
          <p className="mt-2 text-4xl font-black tracking-tight text-[#0B1F3A]">
            {value}
          </p>
        </div>

        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-3xl shadow-sm transition duration-300 group-hover:scale-105">
          {icon}
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus = normalizeValue(status || "PENDIENTE");
  const config = statusConfig[normalizedStatus] || {
    label: normalizedStatus.replaceAll("_", " "),
    badge: "border-slate-200 bg-slate-100 text-slate-700",
    dot: "bg-slate-500",
  };

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold ${config.badge}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function RoleBadge({ role }) {
  const normalizedRole = normalizeValue(role || "CLIENTE");
  const config = roleConfig[normalizedRole] || {
    label: normalizedRole.replaceAll("_", " "),
    styles: "border-slate-200 bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-bold ${config.styles}`}
    >
      {config.label}
    </span>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [requestSearch, setRequestSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [categoryFilter, setCategoryFilter] = useState("TODAS");
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("TODOS");

  const [statusDrafts, setStatusDrafts] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const administratorName =
    user?.name || user?.nombre || "administrador";

  const administratorImage =
    user?.imageUrl ||
    user?.imagen ||
    user?.avatar ||
    adminPerfil;

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, requestsResponse] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/solicitudes"),
      ]);

      setUsers(
        extractList(usersResponse, ["users", "usuarios"]),
      );
      setRequests(
        extractList(requestsResponse, [
          "solicitudes",
          "requests",
          "servicios",
        ]),
      );
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          "No se pudo cargar la información del panel.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!successMessage) return undefined;

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const stats = useMemo(() => {
    const clients = users.filter(
      (currentUser) => getRole(currentUser) === "CLIENTE",
    ).length;
    const technicians = users.filter(
      (currentUser) => getRole(currentUser) === "TECNICO",
    ).length;
    const completed = requests.filter(
      (request) => getStatus(request) === "COMPLETADA",
    ).length;

    return {
      clients,
      technicians,
      requests: requests.length,
      completed,
    };
  }, [requests, users]);

  const categories = useMemo(
    () =>
      [...new Set(requests.map(getCategory))].sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
    [requests],
  );

  const statusCounters = useMemo(
    () =>
      statusOptions.reduce((counters, status) => {
        counters[status] = requests.filter(
          (request) => getStatus(request) === status,
        ).length;
        return counters;
      }, {}),
    [requests],
  );

  const filteredRequests = useMemo(() => {
    const normalizedSearch = requestSearch.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "TODOS" ||
        getStatus(request) === statusFilter;
      const matchesCategory =
        categoryFilter === "TODAS" ||
        getCategory(request) === categoryFilter;

      const searchableText = [
        getRequestTitle(request),
        getCategory(request),
        getClientName(request),
        getTechnicianName(request),
        request?.address,
        request?.direccion,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        matchesCategory &&
        searchableText.includes(normalizedSearch)
      );
    });
  }, [categoryFilter, requestSearch, requests, statusFilter]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = userSearch.trim().toLowerCase();

    return users.filter((currentUser) => {
      const matchesRole =
        roleFilter === "TODOS" || getRole(currentUser) === roleFilter;
      const searchableText = [
        getUserName(currentUser),
        currentUser?.email,
        currentUser?.phone,
        currentUser?.telefono,
        currentUser?.specialty,
        currentUser?.especialidad,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesRole && searchableText.includes(normalizedSearch);
    });
  }, [roleFilter, userSearch, users]);

  const resetRequestFilters = () => {
    setRequestSearch("");
    setStatusFilter("TODOS");
    setCategoryFilter("TODAS");
  };

  const handleStatusChange = async (request) => {
    const requestId = getId(request);
    const nextStatus = statusDrafts[requestId] || getStatus(request);

    if (!requestId || nextStatus === getStatus(request)) return;

    try {
      setUpdatingId(requestId);
      setUpdateError("");

      await api.patch(
        `/admin/solicitudes/${requestId}/estado`,
        { status: nextStatus },
      );

      setRequests((currentRequests) =>
        currentRequests.map((currentRequest) => {
          if (getId(currentRequest) !== requestId) {
            return currentRequest;
          }

          if (
            Object.prototype.hasOwnProperty.call(
              currentRequest,
              "estado",
            ) &&
            !Object.prototype.hasOwnProperty.call(
              currentRequest,
              "status",
            )
          ) {
            return { ...currentRequest, estado: nextStatus };
          }

          return { ...currentRequest, status: nextStatus };
        }),
      );

      setStatusDrafts((currentDrafts) => {
        const nextDrafts = { ...currentDrafts };
        delete nextDrafts[requestId];
        return nextDrafts;
      });

      setSuccessMessage(
        `La solicitud pasó a ${statusConfig[
          nextStatus
        ].label.toLowerCase()}.`,
      );
    } catch (requestError) {
      setUpdateError(
        getApiError(
          requestError,
          "No se pudo actualizar el estado de la solicitud.",
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const renderStatusControls = (request) => {
    const requestId = getId(request);
    const currentStatus = getStatus(request);
    const selectedStatus = statusDrafts[requestId] || currentStatus;
    const isUpdating = updatingId === requestId;
    const hasChanges = selectedStatus !== currentStatus;

    return (
      <div className="flex min-w-[190px] flex-col gap-2">
        <select
          value={selectedStatus}
          onChange={(event) =>
            setStatusDrafts((currentDrafts) => ({
              ...currentDrafts,
              [requestId]: event.target.value,
            }))
          }
          disabled={isUpdating}
          aria-label={`Cambiar estado de ${getRequestTitle(request)}`}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#1976FF] focus:ring-4 focus:ring-blue-100 disabled:cursor-wait disabled:opacity-60"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {statusConfig[status].label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => handleStatusChange(request)}
          disabled={!hasChanges || isUpdating}
          className="rounded-xl bg-gradient-to-r from-[#1976FF] to-[#7C3AED] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {isUpdating ? "Actualizando..." : "Guardar estado"}
        </button>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#E8F4FF] via-[#FFF9F2] to-[#ECFDF7]">
      <Navbar />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="absolute -right-32 top-80 h-[28rem] w-[28rem] rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute left-1/4 top-[55rem] h-96 w-96 rounded-full bg-amber-200/25 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-emerald-200/25 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/30 bg-gradient-to-r from-[#0B1F3A] via-[#0B63CE] to-[#7C3AED] px-6 py-8 text-white shadow-2xl shadow-blue-300/30 sm:px-9">
          <div className="absolute -right-12 -top-24 h-72 w-72 rounded-full bg-cyan-300/25 blur-2xl" />
          <div className="absolute bottom-[-7rem] left-1/2 h-52 w-52 rounded-full bg-fuchsia-300/20 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-base font-bold backdrop-blur-sm">
                Panel de administración
              </span>

              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Hola, {administratorName} 👋
              </h1>

              <p className="mt-2 max-w-3xl text-base leading-7 text-blue-50 sm:text-lg">
                Supervisá usuarios, técnicos y solicitudes desde un solo lugar.
              </p>
            </div>

            <div className="h-40 w-40 shrink-0 overflow-hidden rounded-3xl border-4 border-white/40 bg-white/20 shadow-xl">
              <img
                src={administratorImage}
                alt={`Foto de perfil de ${administratorName}`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base font-semibold">{error}</p>
            <button
              type="button"
              onClick={loadDashboard}
              className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
            >
              Reintentar
            </button>
          </div>
        )}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Clientes registrados"
            value={loading ? "..." : stats.clients}
            icon="👥"
            accent="bg-gradient-to-r from-blue-500 to-cyan-400"
            surface="border-blue-200 bg-gradient-to-br from-white to-blue-100"
            shadow="shadow-blue-200/60"
          />
          <StatCard
            label="Técnicos activos"
            value={loading ? "..." : stats.technicians}
            icon="🧰"
            accent="bg-gradient-to-r from-violet-500 to-fuchsia-400"
            surface="border-violet-200 bg-gradient-to-br from-white to-violet-100"
            shadow="shadow-violet-200/60"
          />
          <StatCard
            label="Solicitudes totales"
            value={loading ? "..." : stats.requests}
            icon="📋"
            accent="bg-gradient-to-r from-amber-400 to-orange-500"
            surface="border-amber-200 bg-gradient-to-br from-white to-amber-100"
            shadow="shadow-amber-200/60"
          />
          <StatCard
            label="Servicios completados"
            value={loading ? "..." : stats.completed}
            icon="✓"
            accent="bg-gradient-to-r from-emerald-400 to-teal-500"
            surface="border-emerald-200 bg-gradient-to-br from-white to-emerald-100"
            shadow="shadow-emerald-200/60"
          />
        </section>

        <section className="mt-7 overflow-hidden rounded-[2rem] border border-blue-100 bg-white/90 shadow-xl shadow-slate-200/70 backdrop-blur-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 via-white to-violet-50 px-5 py-6 sm:px-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#1976FF]">
                  Control general
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#0B1F3A] sm:text-3xl">
                  Gestión de solicitudes
                </h2>
                <p className="mt-2 text-base text-slate-600">
                  Buscá servicios y actualizá su estado según el avance.
                </p>
              </div>

              <span className="w-fit rounded-full bg-[#0B1F3A] px-4 py-2 text-sm font-bold text-white">
                {filteredRequests.length} resultados
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="border-b border-blue-100 bg-gradient-to-b from-[#EFF7FF] via-[#F8F5FF] to-[#FFF8E8] p-5 lg:border-b-0 lg:border-r lg:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-[#0B1F3A]">
                  Filtrar y buscar
                </h3>
                <span className="text-2xl">🔎</span>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">
                    Buscar solicitud
                  </span>
                  <input
                    type="search"
                    value={requestSearch}
                    onChange={(event) =>
                      setRequestSearch(event.target.value)
                    }
                    placeholder="Cliente, técnico o servicio"
                    className="mt-2 w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1976FF] focus:ring-4 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-slate-700">
                    Tipo de servicio
                  </span>
                  <select
                    value={categoryFilter}
                    onChange={(event) =>
                      setCategoryFilter(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-violet-200 bg-white px-4 py-3 text-base font-semibold text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  >
                    <option value="TODAS">Todas las categorías</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-slate-700">
                    Estado
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-base font-semibold text-slate-700 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  >
                    <option value="TODOS">Todos los estados</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusConfig[status].label}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={resetRequestFilters}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#1976FF] hover:bg-blue-50 hover:text-[#1976FF]"
                >
                  Limpiar filtros
                </button>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-sm font-black uppercase tracking-wider text-slate-500">
                  Resumen por estado
                </p>

                <div className="mt-3 space-y-2">
                  {statusOptions.map((status) => {
                    const config = statusConfig[status];

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className="flex w-full items-center justify-between rounded-xl bg-white/80 px-3 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${config.dot}`}
                          />
                          {config.label}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                          {statusCounters[status] || 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <div className="min-w-0 p-4 sm:p-6">
              {updateError && (
                <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-base font-semibold text-rose-700">
                  {updateError}
                </div>
              )}

              {loading && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center text-base font-semibold text-slate-600">
                  Cargando solicitudes...
                </div>
              )}

              {!loading && !error && filteredRequests.length === 0 && (
                <div className="rounded-3xl border border-dashed border-violet-300 bg-gradient-to-br from-violet-50 to-blue-50 p-10 text-center">
                  <span className="text-5xl">📭</span>
                  <h3 className="mt-4 text-xl font-black text-[#0B1F3A]">
                    No encontramos solicitudes
                  </h3>
                  <p className="mt-2 text-base text-slate-600">
                    Probá cambiando o limpiando los filtros.
                  </p>
                </div>
              )}

              {!loading && filteredRequests.length > 0 && (
                <>
                  <div className="hidden overflow-x-auto xl:block">
                    <table className="w-full min-w-[940px] border-separate border-spacing-0 text-left">
                      <thead>
                        <tr className="text-sm uppercase tracking-wide text-slate-500">
                          <th className="border-b border-slate-200 px-3 pb-3 font-black">
                            Solicitud
                          </th>
                          <th className="border-b border-slate-200 px-3 pb-3 font-black">
                            Cliente
                          </th>
                          <th className="border-b border-slate-200 px-3 pb-3 font-black">
                            Estado actual
                          </th>
                          <th className="border-b border-slate-200 px-3 pb-3 font-black">
                            Técnico
                          </th>
                          <th className="border-b border-slate-200 px-3 pb-3 font-black">
                            Actualizar
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredRequests.map((request, index) => (
                          <tr
                            key={getId(request) ?? index}
                            className="group transition hover:bg-blue-50/70"
                          >
                            <td className="border-b border-slate-100 px-3 py-5 align-top">
                              <p className="font-black text-[#0B1F3A]">
                                {getRequestTitle(request)}
                              </p>
                              <span className="mt-2 inline-flex rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1 text-sm font-bold text-orange-800">
                                {getCategory(request)}
                              </span>
                              <p className="mt-2 text-sm font-medium text-slate-500">
                                {formatDate(getDate(request))}
                              </p>
                            </td>
                            <td className="border-b border-slate-100 px-3 py-5 align-top text-base font-semibold text-slate-700">
                              {getClientName(request)}
                            </td>
                            <td className="border-b border-slate-100 px-3 py-5 align-top">
                              <StatusBadge status={getStatus(request)} />
                            </td>
                            <td className="border-b border-slate-100 px-3 py-5 align-top text-base font-semibold text-slate-700">
                              {getTechnicianName(request)}
                            </td>
                            <td className="border-b border-slate-100 px-3 py-5 align-top">
                              {renderStatusControls(request)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid gap-4 xl:hidden">
                    {filteredRequests.map((request, index) => (
                      <article
                        key={getId(request) ?? index}
                        className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/60 p-5 shadow-md"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-black uppercase tracking-wider text-[#1976FF]">
                              {getCategory(request)}
                            </p>
                            <h3 className="mt-1 text-xl font-black text-[#0B1F3A]">
                              {getRequestTitle(request)}
                            </h3>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                              {formatDate(getDate(request))}
                            </p>
                          </div>
                          <StatusBadge status={getStatus(request)} />
                        </div>

                        <dl className="mt-4 grid gap-3 rounded-2xl bg-white/80 p-4 sm:grid-cols-2">
                          <div>
                            <dt className="text-xs font-black uppercase tracking-wider text-slate-400">
                              Cliente
                            </dt>
                            <dd className="mt-1 font-bold text-slate-700">
                              {getClientName(request)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs font-black uppercase tracking-wider text-slate-400">
                              Técnico asignado
                            </dt>
                            <dd className="mt-1 font-bold text-slate-700">
                              {getTechnicianName(request)}
                            </dd>
                          </div>
                        </dl>

                        <div className="mt-4">
                          {renderStatusControls(request)}
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="mt-7 overflow-hidden rounded-[2rem] border border-violet-100 bg-white/90 shadow-xl shadow-violet-100/60 backdrop-blur-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-violet-50 via-white to-cyan-50 px-5 py-6 sm:px-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-600">
                  Comunidad UrbanFix
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#0B1F3A] sm:text-3xl">
                  Monitoreo de usuarios
                </h2>
                <p className="mt-2 text-base text-slate-600">
                  Consultá clientes, técnicos y administradores registrados.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="search"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                  placeholder="Buscar usuario"
                  className="rounded-xl border border-violet-200 bg-white px-4 py-3 text-base text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                  className="rounded-xl border border-cyan-200 bg-white px-4 py-3 text-base font-semibold text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                >
                  <option value="TODOS">Todos los roles</option>
                  <option value="CLIENTE">Clientes</option>
                  <option value="TECNICO">Técnicos</option>
                  <option value="ADMIN">Administradores</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {loading && (
              <div className="rounded-2xl border border-violet-200 bg-violet-50 p-8 text-center text-base font-semibold text-slate-600">
                Cargando usuarios...
              </div>
            )}

            {!loading && !error && filteredUsers.length === 0 && (
              <div className="rounded-3xl border border-dashed border-cyan-300 bg-cyan-50 p-9 text-center">
                <span className="text-5xl">👤</span>
                <h3 className="mt-4 text-xl font-black text-[#0B1F3A]">
                  No encontramos usuarios
                </h3>
                <p className="mt-2 text-base text-slate-600">
                  Probá con otro nombre o cambiá el filtro de rol.
                </p>
              </div>
            )}

            {!loading && filteredUsers.length > 0 && (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
                    <thead>
                      <tr className="text-sm uppercase tracking-wide text-slate-500">
                        <th className="border-b border-slate-200 px-4 pb-3 font-black">
                          Usuario
                        </th>
                        <th className="border-b border-slate-200 px-4 pb-3 font-black">
                          Rol
                        </th>
                        <th className="border-b border-slate-200 px-4 pb-3 font-black">
                          Contacto
                        </th>
                        <th className="border-b border-slate-200 px-4 pb-3 font-black">
                          Especialidad
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((currentUser, index) => {
                        const currentUserName = getUserName(currentUser);

                        return (
                          <tr
                            key={getId(currentUser) ?? index}
                            className="transition hover:bg-violet-50/60"
                          >
                            <td className="border-b border-slate-100 px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1976FF] to-[#7C3AED] text-lg font-black text-white shadow-md shadow-blue-200">
                                  {currentUserName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-black text-[#0B1F3A]">
                                    {currentUserName}
                                  </p>
                                  <p className="mt-0.5 text-sm text-slate-500">
                                    ID: {getId(currentUser) ?? "—"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4">
                              <RoleBadge role={getRole(currentUser)} />
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4">
                              <p className="font-semibold text-slate-700">
                                {currentUser?.email || "Sin correo"}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {currentUser?.phone ||
                                  currentUser?.telefono ||
                                  "Sin teléfono"}
                              </p>
                            </td>
                            <td className="border-b border-slate-100 px-4 py-4 font-semibold text-slate-700">
                              {currentUser?.specialty ||
                                currentUser?.especialidad ||
                                (getRole(currentUser) === "TECNICO"
                                  ? "Sin informar"
                                  : "No corresponde")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-4 md:hidden">
                  {filteredUsers.map((currentUser, index) => {
                    const currentUserName = getUserName(currentUser);

                    return (
                      <article
                        key={getId(currentUser) ?? index}
                        className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-5 shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1976FF] to-[#7C3AED] text-lg font-black text-white">
                            {currentUserName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-black text-[#0B1F3A]">
                              {currentUserName}
                            </h3>
                            <p className="truncate text-sm text-slate-500">
                              {currentUser?.email || "Sin correo"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <RoleBadge role={getRole(currentUser)} />
                          <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm">
                            {currentUser?.specialty ||
                              currentUser?.especialidad ||
                              "Sin especialidad"}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {successMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border border-emerald-200 bg-emerald-600 px-5 py-4 text-base font-bold text-white shadow-2xl shadow-emerald-300/50"
        >
          ✓ {successMessage}
        </div>
      )}
       <Footer />
    </div>
  );
}