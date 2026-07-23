export function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`rounded-lg border border-gray-300 px-3 py-2 outline-none
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          ${disabled ? "cursor-not-allowed bg-gray-100 opacity-50" : ""}
        `}
      />
    </div>
  );
}