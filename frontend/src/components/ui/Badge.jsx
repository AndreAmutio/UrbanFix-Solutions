export function Badge({ children, variant = "pending" }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    progress: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium
        ${styles[variant]}
      `}
    >
      {children}
    </span>
  );
}