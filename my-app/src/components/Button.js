// Button.js
import React from "react";

const Button = ({
  onClick,
  children,
  type = "button",
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyles = "px-4 py-2 rounded-full transition-colors";

  // Define variant styles
  const variantStyles = {
    default: "bg-gray-200 text-black hover:bg-gray-300",
    primary: "bg-[#a62626] text-white hover:bg-[#a62828]",
    secondary:
      "bg-white border border-[#a62626] text-[#a62626] hover:bg-[#f2f2f2]",
    modalCancel:
      "px-6 py-2 text-gray-600 hover:text-gray-800 rounded-full border border-gray-300 hover:border-gray-400 transition-colors",
    modalDelete:
      "px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
