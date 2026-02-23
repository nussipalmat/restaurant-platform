const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-black uppercase tracking-tighter transition-all duration-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-4 border-black active:translate-x-1 active:translate-y-1 active:shadow-none';
  
  const variants = {
    primary: 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-600',
    secondary: 'bg-gray-200 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-300',
    success: 'bg-green-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-500',
    danger: 'bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600',
    dark: 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:bg-gray-900',
    warning: 'bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-500',
    outline: 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50',
    ghost: 'border-transparent shadow-none hover:bg-black hover:text-white',
  };
  
  const sizes = {
    xs: 'px-2 py-1 text-xs border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-xl',
    xl: 'px-10 py-5 text-2xl italic',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-3 stroke-[3px]" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-100"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;