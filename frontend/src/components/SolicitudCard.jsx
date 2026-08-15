import { useState } from "react";

const statusConfig = {
  PENDIENTE: {
    label: "Pendiente",
    styles: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-500",
  },
  ACEPTADA: {
    label: "Aceptada",
    styles: "border-blue-200 bg-blue-50 text-blue-800",
    dot: "bg-blue-500",
  },
  EN_PROGRESO: {
    label: "En progreso",
    styles: "border-yellow-200 bg-yellow-50 text-yellow-800",
    dot: "bg-yellow-500",
  },
  COMPLETADA: {
    label: "Completada",
    styles: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-500",
  },
  RECHAZADA: {
    label: "Rechazada",
    styles: "border-red-200 bg-red-50 text-red-800",
    dot: "bg-red-500",
  },
  CANCELADA: {
    label: "Cancelada",
    styles: "border-slate-300 bg-slate-100 text-slate-700",
    dot: "bg-slate-500",
  },
};

const categoryConfig = {
  ELECTRICIDAD: {
    label: "Electricidad",
    icon: "⚡",
    accent: "border-l-amber-400",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
  },
  PLOMERIA: {
    label: "Plomería",
    icon: "💧",
    accent: "border-l-cyan-500",
    badge: "border-cyan-200 bg-cyan-50 text-cyan-800",
  },
  INFORMATICA: {
    label: "Informática",
    icon: "🖥️",
    accent: "border-l-indigo-500",
    badge: "border-indigo-200 bg-indigo-50 text-indigo-800",
  },
  GASISTAS: {
    label: "Gas",
    icon: "🔥",
    accent: "border-l-orange-500",
    badge: "border-orange-200 bg-orange-50 text-orange-800",
  },
  GAS: {
    label: "Gas",
    icon: "🔥",
    accent: "border-l-orange-500",
    badge: "border-orange-200 bg-orange-50 text-orange-800",
  },
};

const normalizeValue = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

const formatScheduledDate = (date) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
};

export default function SolicitudCard({
  request = {},
  children,
  collapsible = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const status = normalizeValue(
    request.status || request.estado || "PENDIENTE",
  );

  const statusInfo = statusConfig[status] || {
    label: status.replaceAll("_", " "),
    styles: "border-slate-200 bg-slate-50 text-slate-700",
    dot: "bg-slate-400",
  };

  const category = normalizeValue(
    request.category || request.categoria || "SERVICIO",
  );

  const categoryInfo = categoryConfig[category] || {
    label:
      request.category ||
      request.categoria ||
      "Servicio técnico",
    icon: "🛠️",
    accent: "border-l-blue-500",
    badge: "border-blue-200 bg-blue-50 text-blue-800",
  };

  const title =
    request.title ||
    request.titulo ||
    "Solicitud de servicio";

  const description =
    request.description || request.descripcion;

  const address =
    request.address || request.direccion;

  const scheduledDate =
    request.scheduledDate || request.fechaProgramada;

  const imageUrl =
    request.imageUrl || request.imagenUrl;

  const details = (
    <>
      {description && (
        <p className="mt-2 text-base leading-7 text-slate-600">
          {description}
        </p>
      )}

      {(address || scheduledDate) && (
        <div className="mt-4 grid gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-base text-slate-600">
          {address && (
            <p className="flex items-start gap-2">
              <span aria-hidden="true">📍</span>
              <span>{address}</span>
            </p>
          )}

          {scheduledDate && (
            <p className="flex items-start gap-2">
              <span aria-hidden="true">📅</span>
              <span>{formatScheduledDate(scheduledDate)}</span>
            </p>
          )}
        </div>
      )}

      {imageUrl && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-[#0B1F3A]">
            Fotografía del problema
          </p>

          <img
            src={imageUrl}
            alt={`Fotografía del problema: ${title}`}
            className="max-h-96 w-full rounded-xl border border-slate-200 object-cover"
          />
        </div>
      )}

      {children && (
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end [&>button]:w-full sm:[&>button]:w-auto">
          {children}
        </div>
      )}
    </>
  );

  /* Vista normal: Técnico y Admin */
  if (!collapsible) {
    return (
      <article
        className={`group overflow-hidden rounded-2xl border border-l-4 border-slate-200 ${categoryInfo.accent} bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold ${categoryInfo.badge}`}
          >
            <span aria-hidden="true">
              {categoryInfo.icon}
            </span>
            {categoryInfo.label}
          </span>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold ${statusInfo.styles}`}
          >
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-full ${statusInfo.dot}`}
            />
            {statusInfo.label}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold leading-7 text-[#0B1F3A]">
          {title}
        </h3>

        {details}
      </article>
    );
  }

  /* Vista desplegable: Cliente */
  return (
    <article
      className={`overflow-hidden rounded-2xl border border-l-4 border-slate-200 ${categoryInfo.accent} bg-white shadow-sm transition duration-300 hover:shadow-md`}
    >
      <button
        type="button"
        onClick={() =>
          setIsOpen((current) => !current)
        }
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={isOpen}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold ${categoryInfo.badge}`}
            >
              <span aria-hidden="true">
                {categoryInfo.icon}
              </span>
              {categoryInfo.label}
            </span>

            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold ${statusInfo.styles}`}
            >
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${statusInfo.dot}`}
              />
              {statusInfo.label}
            </span>
          </div>

          <h3 className="mt-3 truncate text-lg font-bold text-[#0B1F3A]">
            {title}
          </h3>
        </div>

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600 transition ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ↓
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4">
          {details}
        </div>
      )}
    </article>
  );
}