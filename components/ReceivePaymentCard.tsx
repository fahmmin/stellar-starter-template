"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface ReceivePaymentCardProps {
    address: string;
}

const ReceivePaymentCard: React.FC<ReceivePaymentCardProps> = ({ address }) => {
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Receive Payment</h3>
            <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <QRCodeSVG value={address} size={200} level="H" />
                </div>
                <div className="w-full">
                    <p className="text-sm text-gray-600 mb-2 text-center">
                        Scan QR code or copy address below
                    </p>
                    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                        <code className="flex-1 text-xs font-mono text-gray-800 break-all">
                            {address}
                        </code>
                        <button
                            onClick={copyAddress}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                        >
                            {copied ? "✓ Copied" : "Copy"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceivePaymentCard;

