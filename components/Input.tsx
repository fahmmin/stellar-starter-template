import React from "react";

interface InputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    required?: boolean;
    step?: string;
}

const Input: React.FC<InputProps> = ({
    type,
    placeholder,
    value,
    onChange,
    className = "",
    required = false,
    step,
}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            step={step}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className}`}
        />
    );
};

export default Input;