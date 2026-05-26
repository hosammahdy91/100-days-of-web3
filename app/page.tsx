'use client'

import { useEffect, useState } from 'react'

import { Copy, CheckCircle2, Wallet } from 'lucide-react'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import {
  useAccount,
  useBalance,
  useChainId,
} from 'wagmi'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  const [copied, setCopied] = useState(false)

  const { address, isConnected } = useAccount()

  const chainId = useChainId()

  const { data: balance } = useBalance({
    address,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const copyAddress = async () => {
    if (!address) return

    await navigator.clipboard.writeText(address)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-8 h-8 text-green-400" />

          <div>
            <h1 className="text-3xl font-bold">
              Day 02 🚀
            </h1>

            <p className="text-zinc-400 text-sm">
              Wallet Dashboard
            </p>
          </div>
        </div>

        <div className="mb-6">
          <ConnectButton />
        </div>

        {isConnected ? (
          <div className="space-y-4">

            <div className="rounded-2xl bg-zinc-800 p-4">

              <div className="flex items-center justify-between mb-2">
                <p className="text-zinc-400 text-sm">
                  Wallet Address
                </p>

                <button
                  onClick={copyAddress}
                  className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <p className="break-all text-sm">
                {address}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-800 p-4">
              <p className="text-zinc-400 text-sm mb-1">
                Balance
              </p>

              <p className="text-2xl font-bold">
                {balance?.formatted.slice(0, 6)} {balance?.symbol}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-800 p-4">
              <p className="text-zinc-400 text-sm mb-1">
                Network
              </p>

              <p className="text-xl font-bold">
                Chain ID: {chainId}
              </p>
            </div>

          </div>
        ) : (
          <div className="rounded-2xl bg-zinc-800 p-6 text-center">
            <p className="text-red-400">
              Wallet Not Connected
            </p>
          </div>
        )}

      </div>

    </main>
  )
}