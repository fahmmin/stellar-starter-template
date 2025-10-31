"use client";

import React, { useState } from "react";

interface WalletInfoCardProps {
    address: string;
    balance: string;
    accountType?: string;
    sequenceNumber?: string;
}

const WalletInfoCard: React.FC<WalletInfoCardProps> = ({
    address,
    balance,
    accountType = "Account",
    sequenceNumber,
}) => {
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium opacity-90">Connected</span>
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                    {accountType}
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm opacity-80 mb-2">Wallet Address</p>
                <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                    <code className="text-sm font-mono">{formatAddress(address)}</code>
                    <button
                        onClick={copyAddress}
                        className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
                    >
                        {copied ? "✓ Copied" : "Copy"}
                    </button>
                </div>
            </div>

            <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm opacity-80 mb-1">Balance</p>
                        <p className="text-3xl font-bold">{balance} XLM</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs opacity-70">Testnet</p>
                        {sequenceNumber && (
                            <p className="text-xs opacity-60 mt-1">
                                Seq: {sequenceNumber}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletInfoCard;

