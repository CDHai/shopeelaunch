const Button = ({ children, type = 'button', variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
    
    const variants = {
      primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500",
      outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500"
    };
  
    return (
      <button
        type={type}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  export default Button;