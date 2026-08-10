export function ServiceCategoryCard({
  name,
  description,
  price,
  image,
  icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
    >
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        {image ? (
          <img
            src={image}
            alt=""
            className="h-20 w-20 object-contain transition group-hover:scale-110"
          />
        ) : (
          <span className="text-4xl">{icon}</span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-[#0B1F3A]">
          {name}
        </h3>

        <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
          {description}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Precio orientativo
            </p>

            <p className="mt-1 font-bold text-[#1976FF]">
              {price}
            </p>
          </div>

          <span className="text-xl text-[#1976FF] transition group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </button>
  );
}