export function Card({ children, title }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {title && (
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          {title}
        </h3>
      )}

      {children}
    </div>
  );
}