export function Input({ name, label, error, ...props }) {
  return (
    <div className="flex flex-col">
      <label htmlFor="email"
        className="text-sm font-bold text-gray-500 mb-2"
      >
        {label}
      </label>
      <input
        className={`p-3 border border-gray-700 rounded-xl focus:outline focus:outline-1 focus:outline-gray-700 ${error && 'border-red-300'}`}
        {...props}
        name={name}
        id={name}
      />
      <span className="p-2 text-sm text-red-300">{error}</span>
    </div>
  )
}