"use client";

import React from "react";

interface NetworkSwitcherProps {
    isMainnet: boolean;
    onToggle: (isMainnet: boolean) => void;
}

const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({
    isMainnet,
    onToggle,
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div
                        className={`w-2 h-2 rounded-full ${isMainnet ? "bg-green-500" : "bg-yellow-500"
                            } ${!isMainnet ? "animate-pulse" : ""}`}
                    ></div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Network
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onToggle(false)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${!isMainnet
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                    >
                        Testnet
                    </button>
                    <button
                        onClick={() => onToggle(true)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${isMainnet
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                    >
                        Mainnet
                    </button>
                </div>
            </div>
            {isMainnet && (
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-xs text-red-700 dark:text-red-400 font-medium">
                        ⚠️ Mainnet uses real money. Transactions are irreversible.
                    </p>
                </div>
            )}
        </div>
    );
};

export default NetworkSwitcher;

