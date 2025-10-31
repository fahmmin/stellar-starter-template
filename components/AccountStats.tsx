"use client";

import React, { useEffect, useState } from "react";

interface AccountStatsProps {
    address: string;
    balance: string;
}

interface Stats {
    totalSent: number;
    totalReceived: number;
    transactionCount: number;
}

const AccountStats: React.FC<AccountStatsProps> = ({ address, balance }) => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!address) return;

            try {
                setLoading(true);
                const response = await fetch(
                    `https://horizon-testnet.stellar.org/accounts/${address}/payments?limit=200`
                );

                if (response.ok) {
                    const data = await response.json();
                    const records = data._embedded?.records || [];

                    let totalSent = 0;
                    let totalReceived = 0;

                    records.forEach((payment: any) => {
                        const amount = parseFloat(payment.amount || 0);
                        // If payment is FROM this account, it's sent
                        // If payment is TO this account, it's received
                        if (payment.from === address) {
                            totalSent += amount;
                        } else {
                            totalReceived += amount;
                        }
                    });

                    setStats({
                        totalSent,
                        totalReceived,
                        transactionCount: records.length,
                    });
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [address]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Account Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Account Stats</h3>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Total Sent</p>
                    <p className="text-lg font-bold text-gray-800">
                        {stats.totalSent.toFixed(2)} XLM
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Total Received</p>
                    <p className="text-lg font-bold text-green-600">
                        {stats.totalReceived.toFixed(2)} XLM
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Transactions</p>
                    <p className="text-lg font-bold text-gray-800">
                        {stats.transactionCount}
                    </p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Balance</span>
                    <span className="text-xl font-bold text-purple-600">{balance} XLM</span>
                </div>
            </div>
        </div>
    );
};

export default AccountStats;

