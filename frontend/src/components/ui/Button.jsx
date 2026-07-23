export function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  type = "button",
}) {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 font-medium transition-colors
        ${styles[variant]}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
      `}
    >
      {children}
    </button>
  );
}