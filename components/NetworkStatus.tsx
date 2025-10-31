"use client";

import React from "react";

interface NetworkStatusProps {
    isMainnet: boolean;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ isMainnet }) => {
    return (
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${isMainnet
                ? "bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700"
                : "bg-yellow-100 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700"
            }`}>
            <div className={`w-2 h-2 rounded-full ${isMainnet ? "bg-green-500" : "bg-yellow-500"
                } ${!isMainnet ? "animate-pulse" : ""}`}></div>
            <span className={`text-xs font-semibold ${isMainnet
                    ? "text-green-800 dark:text-green-200"
                    : "text-yellow-800 dark:text-yellow-200"
                }`}>
                {isMainnet ? "Mainnet" : "Testnet"}
            </span>
        </div>
    );
};

export default NetworkStatus;

