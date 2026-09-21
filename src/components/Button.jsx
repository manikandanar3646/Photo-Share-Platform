function Button({
  children,
  onClick,
  type = 'button',
  className = ''
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 ${className}`}
    >
      {children}
    </button>
  )
}

export default Button