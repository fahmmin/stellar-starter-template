"use client";

import React, { useState } from "react";

import Button from "./Button";
import Input from "./Input";

interface SendPaymentFormProps {
    onSubmit: (destination: string, amount: string) => void;
}

const SendPaymentForm: React.FC<SendPaymentFormProps> = ({ onSubmit }) => {
    const [destination, setDestination] = useState("");
    const [amount, setAmount] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(destination, amount);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label
                    htmlFor="destination"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                >
                    Destination Address
                </label>
                <Input
                    type="text"
                    placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    value={destination}
                    required
                    onChange={(e) => setDestination(e.target.value)}
                    className="focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Enter a valid Stellar address (starts with G, 56 characters)
                </p>
            </div>
            <div>
                <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                >
                    Amount (XLM)
                </label>
                <div className="relative">
                    <Input
                        type="number"
                        step="0.0000001"
                        placeholder="0.0"
                        value={amount}
                        required
                        onChange={(e) => setAmount(e.target.value)}
                        className="focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-16"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span className="text-gray-500 font-medium">XLM</span>
                    </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    Minimum: 0.0000001 XLM
                </p>
            </div>
            <Button
                type="submit"
                disabled={!destination || !amount}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed py-3 text-lg"
            >
                Send Payment
            </Button>
        </form>
    );
};

export default SendPaymentForm;