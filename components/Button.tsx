import React from "react";

interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    children,
    disabled = false,
    className = "",
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline ${disabled ? "opacity-50 cursor-not-allowed" : ""
                } ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;