"use client";

import React, { useEffect, useState } from "react";

interface Transaction {
    id: string;
    type: string;
    amount: string;
    destination?: string;
    timestamp: string;
    hash: string;
}

interface TransactionHistoryProps {
    address: string;
    isMainnet?: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
    address,
    isMainnet = false
}) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!address) return;

            try {
                setLoading(true);
                // Use Horizon API directly for transaction history
                const horizonUrl = isMainnet
                    ? "https://horizon.stellar.org"
                    : "https://horizon-testnet.stellar.org";
                const response = await fetch(
                    `${horizonUrl}/accounts/${address}/payments?limit=10&order=desc`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch transactions");
                }

                const data = await response.json();
                const txList: Transaction[] = data._embedded?.records?.map((payment: any) => {
                    return {
                        id: payment.id || payment.transaction_hash,
                        type: payment.type === "payment" ? "Payment" : payment.type || "Other",
                        amount: payment.amount || "0",
                        destination: payment.to || payment.account || "",
                        timestamp: payment.created_at
                            ? new Date(payment.created_at).toLocaleDateString()
                            : "Unknown",
                        hash: payment.transaction_hash || "",
                    };
                }) || [];

                setTransactions(txList);
            } catch (error: any) {
                console.error("Error fetching transactions:", error);
                // If account doesn't exist or has no transactions, show empty state
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [address, isMainnet]);

    const formatAddress = (addr: string) => {
        if (!addr) return "Unknown";
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-500">Loading transactions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
                Recent Transactions
            </h3>
            {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No transactions found</p>
                    <p className="text-sm mt-2">Your transaction history will appear here</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {transactions.map((tx) => (
                        <div
                            key={tx.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${tx.type === "Payment"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {tx.type}
                                        </span>
                                        <span className="text-xs text-gray-500">{tx.timestamp}</span>
                                    </div>
                                    {tx.destination && (
                                        <p className="text-sm text-gray-600 font-mono">
                                            To: {formatAddress(tx.destination)}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500 font-mono mt-1">
                                        {formatAddress(tx.hash)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-gray-800">
                                        {tx.amount} XLM
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;

