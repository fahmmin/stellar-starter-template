import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import React from "react";
import { Toaster } from "react-hot-toast";
import TwitterButton from "../components/TwitterButton";
import DarkModeToggle from "../components/DarkModeToggle";

export const metadata: Metadata = {
  title: "Stellar Payment DApp",
  description: "Payment DApp built on Stellar",
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-md border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">⭐</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Stellar Wallet
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <DarkModeToggle />
                <TwitterButton />
              </div>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
};

export default Layout;