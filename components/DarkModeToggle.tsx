"use client";

import React, { useEffect, useState } from "react";

const DarkModeToggle: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check localStorage or system preference
        const stored = localStorage.getItem("darkMode");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = stored ? stored === "true" : prefersDark;

        setDarkMode(isDark);
        applyDarkMode(isDark);
    }, []);

    const applyDarkMode = (dark: boolean) => {
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("darkMode", String(newMode));
        applyDarkMode(newMode);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
        >
            {darkMode ? (
                <span className="text-xl">🌙</span>
            ) : (
                <span className="text-xl">☀️</span>
            )}
        </button>
    );
};

export default DarkModeToggle;

