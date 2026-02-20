import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  required = false,
  className = '',
  helperText,
  ...props
}, ref) => {
  return (
    <div className="w-full group">
      {label && (
        <label className="block text-xs font-black uppercase tracking-widest text-black mb-2 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500 text-lg leading-none">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 
            border-4 border-black 
            text-black font-bold text-lg
            placeholder:text-gray-400 placeholder:italic
            focus:outline-none focus:bg-yellow-50 focus:shadow-none
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            transition-all
            ${error ? 'bg-red-50 border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]' : 'bg-white'} 
            ${className}
          `}
          {...props}
        />
      </div>

      {helperText && !error && (
        <p className="mt-2 text-xs font-black uppercase tracking-tighter text-gray-500 italic">
          // {helperText}
        </p>
      )}
      
      {error && (
        <p className="mt-2 text-xs font-black uppercase tracking-tight text-red-600 flex items-center gap-1">
          <span className="bg-red-600 text-white px-1 leading-none">!</span> {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;