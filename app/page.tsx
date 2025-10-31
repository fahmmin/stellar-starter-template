"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import SendPaymentForm from "../components/SendPaymentForm";
import WalletInfoCard from "../components/WalletInfoCard";
import TransactionHistory from "../components/TransactionHistory";
import NetworkStatus from "../components/NetworkStatus";
import NetworkSwitcher from "../components/NetworkSwitcher";
import ReceivePaymentCard from "../components/ReceivePaymentCard";
import XLMPrice from "../components/XLMPrice";
import AccountStats from "../components/AccountStats";
import * as StellarSdk from "@stellar/stellar-sdk";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import {
  isConnected,
  setAllowed,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";

interface AccountInfo {
  balance: string;
  sequenceNumber: string;
  accountType: string;
}

export default function Home() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isMainnet, setIsMainnet] = useState(false);

  // Network configuration
  const getNetworkConfig = () => {
    if (isMainnet) {
      return {
        rpcUrl: "https://horizon.stellar.org",
        horizonUrl: "https://horizon.stellar.org",
        networkPassphrase: StellarSdk.Networks.PUBLIC,
        name: "Mainnet",
      };
    }
    return {
      rpcUrl: "https://soroban-testnet.stellar.org",
      horizonUrl: "https://horizon-testnet.stellar.org",
      networkPassphrase: StellarSdk.Networks.TESTNET,
      name: "Testnet",
    };
  };

  const fetchAccountInfo = useCallback(async (address: string) => {
    try {
      setLoading(true);
      const config = getNetworkConfig();

      // Use Horizon for account info (works better with mainnet)
      const horizonUrl = isMainnet
        ? "https://horizon.stellar.org"
        : "https://horizon-testnet.stellar.org";

      const accountResponse = await fetch(
        `${horizonUrl}/accounts/${address}`
      );

      if (accountResponse.ok) {
        const accountData = await accountResponse.json();

        // Get native XLM balance
        const nativeBalance = accountData.balances?.find(
          (b: any) => b.asset_type === "native",
        );
        const balance = nativeBalance
          ? parseFloat(nativeBalance.balance).toFixed(2)
          : "0.00";

        setAccountInfo({
          balance,
          sequenceNumber: accountData.sequence || "0",
          accountType: "Stellar Account",
        });
      } else {
        throw new Error("Account not found");
      }
    } catch (error) {
      console.error("Error fetching account info:", error);
      setAccountInfo({
        balance: "0.00",
        sequenceNumber: "0",
        accountType: "New Account",
      });
    } finally {
      setLoading(false);
    }
  }, [isMainnet]);

  useEffect(() => {
    const checkFreighter = async () => {
      try {
        const connected = await isConnected();
        if (connected) {
          const pubKey = await getAddress();
          setPublicKey(pubKey.address);
          await fetchAccountInfo(pubKey.address);
        }
      } catch (error) {
        console.error("Error checking Freighter connection:", error);
      }
    };

    checkFreighter();
  }, []);

  useEffect(() => {
    // Refresh balance when publicKey changes
    if (publicKey) {
      fetchAccountInfo(publicKey);
      // Refresh balance every 10 seconds
      const interval = setInterval(() => {
        fetchAccountInfo(publicKey);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [publicKey, isMainnet, fetchAccountInfo]);

  const handleConnectWallet = async () => {
    try {
      await setAllowed();
      const pubKey = await getAddress();
      setPublicKey(pubKey.address);
      await fetchAccountInfo(pubKey.address);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting to Freighter:", error);
      toast.error("Failed to connect wallet. Make sure Freighter is installed and unlocked.");
    }
  };

  const handleSendPayment = async (destination: string, amount: string) => {
    if (!publicKey) {
      toast.error("Please connect your wallet first!");
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Validate address
    if (!destination.startsWith("G") || destination.length !== 56) {
      toast.error("Please enter a valid Stellar address (starts with G, 56 characters)");
      return;
    }

    try {
      setSending(true);
      const config = getNetworkConfig();

      // Use Horizon for account fetching, then RPC for transaction
      const horizonUrl = isMainnet
        ? "https://horizon.stellar.org"
        : "https://horizon-testnet.stellar.org";

      const accountResponse = await fetch(`${horizonUrl}/accounts/${publicKey}`);
      if (!accountResponse.ok) {
        throw new Error("Account not found");
      }
      const accountData = await accountResponse.json();

      // Use RPC server for building transaction
      const server = new StellarRpc.Server(config.rpcUrl);
      const sourceAccount = await server.getAccount(publicKey);
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: config.networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destination,
            asset: StellarSdk.Asset.native(),
            amount: amount,
          }),
        )
        .setTimeout(30)
        .build();

      const signedTransaction = await signTransaction(transaction.toXDR(), {
        networkPassphrase: config.networkPassphrase,
      });

      const transactionResult = await server.sendTransaction(
        StellarSdk.TransactionBuilder.fromXDR(
          signedTransaction.signedTxXdr,
          config.networkPassphrase,
        ),
      );

      console.log("Transaction successful:", transactionResult);

      // Refresh balance after successful transaction
      await fetchAccountInfo(publicKey);

      toast.success(
        `Payment of ${amount} XLM sent successfully!`,
        {
          duration: 5000,
        }
      );

      // Show transaction hash in console for reference
      console.log("Transaction Hash:", transactionResult.hash);
    } catch (error: any) {
      console.error("Error sending payment:", error);
      toast.error(
        error.message || "Error sending payment. Please check the console for details."
      );
    } finally {
      setSending(false);
    }
  };

  const handleNetworkToggle = (mainnet: boolean) => {
    if (mainnet) {
      toast.error(
        "⚠️ Switching to Mainnet - Real money at risk!",
        { duration: 3000 }
      );
    }
    setIsMainnet(mainnet);
    // Refresh account info with new network
    if (publicKey) {
      fetchAccountInfo(publicKey);
    }
  };

  return (
    <div className="px-4 space-y-6">
      {/* Top Bar: Price, Network Switcher, and Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <XLMPrice />
        <NetworkSwitcher isMainnet={isMainnet} onToggle={handleNetworkToggle} />
        <div className="flex items-center justify-center">
          <NetworkStatus isMainnet={isMainnet} />
        </div>
      </div>

      {publicKey ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Wallet Info & Actions */}
          <div className="space-y-6">
            {/* Wallet Info Card */}
            {accountInfo ? (
              <WalletInfoCard
                address={publicKey}
                balance={accountInfo.balance}
                accountType={accountInfo.accountType}
                sequenceNumber={accountInfo.sequenceNumber}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            )}

            {/* Receive Payment Card */}
            <ReceivePaymentCard address={publicKey} />

            {/* Send Payment Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Send Payment
              </h2>
              <SendPaymentForm onSubmit={handleSendPayment} />
              {sending && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm font-medium">
                    Processing transaction...
                  </span>
                </div>
              )}
            </div>

            {/* Account Stats */}
            {accountInfo && (
              <AccountStats address={publicKey} balance={accountInfo.balance} />
            )}
          </div>

          {/* Right Column - Transaction History */}
          <div>
            <TransactionHistory address={publicKey} isMainnet={isMainnet} />
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your Freighter wallet to start sending payments on the
              Stellar network
            </p>
            <button
              onClick={handleConnectWallet}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </span>
              ) : (
                "Connect Freighter Wallet"
              )}
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Don't have Freighter?{" "}
              <a
                href="https://freighter.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Install it here
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}