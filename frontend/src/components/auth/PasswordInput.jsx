import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const PasswordInput = ({ value, onChange, placeholder = "Password", name, required = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
        ) : (
          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput; 