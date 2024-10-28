const Input = ({ label, error, ...props }) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm 
            focus:outline-none focus:ring-primary-500 focus:border-primary-500
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };
  
  export default Input;