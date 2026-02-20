const Loading = ({ size = 'md', fullScreen = false, text = 'Processing Data...' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className={`relative ${sizes[size]} animate-spin`}>
        <div className="absolute inset-0 border-4 border-dashed border-black rounded-none"></div>
        <div className="absolute inset-2 border-4 border-black bg-yellow-400"></div>
      </div>
      {text && (
        <p className="mt-6 font-black uppercase tracking-widest text-black italic animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm z-50 p-4">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
};

export default Loading;