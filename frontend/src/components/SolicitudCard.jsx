const statusConfig = {
  PENDIENTE: {
    label: "Pendiente",
    styles: "bg-amber-100 text-amber-700",
  },
  ACEPTADA: {
    label: "Aceptada",
    styles: "bg-blue-100 text-blue-700",
  },
  EN_PROGRESO: {
     label: "En progreso",
    styles: "bg-yellow-100 text-yellow-700",
  },
  COMPLETADA: {
    label: "Completada",
    styles: "bg-emerald-100 text-emerald-700",
  },
  RECHAZADA: {
    label: "Rechazada",
    styles: "bg-red-100 text-red-700",
  },
  CANCELADA: {
    label: "Cancelada",
    styles: "bg-slate-200 text-slate-700",
  },
};

export default function SolicitudCard({ request, children }) {
  const status = (request.status || request.estado || "PENDIENTE")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  const statusInfo = statusConfig[status] || {
    label: status.replaceAll("_", " "),
    styles: "bg-slate-100 text-slate-700",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#1976FF]">
            {request.category}
          </p>

          <h3 className="mt-1 text-lg font-bold text-[#0B1F3A]">
            {request.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {request.description}
          </p>

          {request.address && (
            <p className="mt-3 text-sm text-slate-600">
              📍 {request.address}
            </p>
          )}

          {request.scheduledDate && (
            <p className="mt-1 text-sm text-slate-600">
              📅{" "}
              {new Date(request.scheduledDate).toLocaleString(
                "es-AR",
              )}
            </p>
          )}
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-m font-bold shadow-sm ${statusInfo.styles}`}  
        >
          {statusInfo.label}
        </span>
      </div>

      {children && (
        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
          {children}
        </div>
      )}
    </article>
  );
}