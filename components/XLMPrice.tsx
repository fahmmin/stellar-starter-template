"use client";

import React, { useEffect, useState } from "react";

const XLMPrice: React.FC = () => {
    const [price, setPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [change24h, setChange24h] = useState<number | null>(null);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                // Using CoinGecko API for XLM price
                const response = await fetch(
                    "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd&include_24hr_change=true"
                );
                const data = await response.json();
                if (data.stellar) {
                    setPrice(data.stellar.usd);
                    setChange24h(data.stellar.usd_24h_change || 0);
                }
            } catch (error) {
                console.error("Error fetching XLM price:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrice();
        // Refresh every 60 seconds
        const interval = setInterval(fetchPrice, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
                <div className="animate-pulse flex items-center space-x-2">
                    <div className="h-4 bg-white/30 rounded w-24"></div>
                </div>
            </div>
        );
    }

    if (price === null) {
        return null;
    }

    const isPositive = change24h !== null && change24h >= 0;

    return (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-90">XLM Price</p>
                    <p className="text-2xl font-bold">${price.toFixed(4)}</p>
                </div>
                {change24h !== null && (
                    <div className="text-right">
                        <p className="text-xs opacity-90">24h Change</p>
                        <p
                            className={`text-lg font-semibold ${isPositive ? "text-green-200" : "text-red-200"
                                }`}
                        >
                            {isPositive ? "+" : ""}
                            {change24h.toFixed(2)}%
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default XLMPrice;

