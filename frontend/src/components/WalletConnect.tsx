"use client";

import { useFreighter } from "@/hooks/useFreighter";
import { useState, useRef, useEffect } from "react";

interface WalletConnectProps {
  className?: string;
}

/**
 * Smart wallet connect button that handles different auth states:
 * - Not Installed: Links to Freighter extension
 * - Disconnected: Shows "Connect Wallet"
 * - Connecting: Shows loading spinner
 * - Connected: Shows truncated address with disconnect option
 */
export function WalletConnect({ className = "" }: WalletConnectProps) {
  const { address, isConnecting, isConnected, isFreighterInstalled, connect, disconnect } = useFreighter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const truncateAddress = (addr: string): string => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  if (!isFreighterInstalled) {
    return (
      <a
        href="https://freighter.app"
        target="_blank"
        rel="noopener noreferrer"
        className={`btn-primary text-sm inline-flex items-center justify-center ${className}`}
      >
        Install Freighter
      </a>
    );
  }

  if (isConnecting) {
    return (
      <button disabled className={`btn-primary text-sm inline-flex items-center space-x-2 opacity-75 cursor-wait ${className}`}>
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Connecting...</span>
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`btn-secondary text-sm inline-flex w-full justify-center gap-x-1.5 ${className}`}
        >
          {truncateAddress(address)}
          <svg className="-mr-1 h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#1a1c23] dark:ring-white/10 dark:text-white">
            <div className="py-1">
              <button
                onClick={() => {
                  disconnect();
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className={`btn-primary text-sm ${className}`}
    >
      Connect Wallet
    </button>
  );
}
