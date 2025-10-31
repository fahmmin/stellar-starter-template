"use client";

import React from "react";

const TwitterButton: React.FC = () => {
    const handleOpenTwitter = () => {
        window.open("https://x.com/fahmin_md", "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={handleOpenTwitter}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
            dont open 🙈
        </button>
    );
};

export default TwitterButton;

