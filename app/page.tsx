'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import {
  useAccount,
} from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

        <h1 className="text-3xl font-bold mb-6">
          Day 01 🚀
        </h1>

        <p className="text-zinc-400 mb-6">
          Web3 Wallet Connection App
        </p>

        <div className="mb-6">
          <ConnectButton />
        </div>

        {isConnected ? (
          <div className="space-y-2">
            <p className="text-green-400">
              Wallet Connected ✅
            </p>

            <div className="rounded-xl bg-zinc-800 p-4 break-all">
              {address}
            </div>
          </div>
        ) : (
          <p className="text-red-400">
            Wallet Not Connected
          </p>
        )}

      </div>
    </main>
  )
}