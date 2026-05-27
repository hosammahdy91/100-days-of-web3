'use client'

import { useEffect, useState } from 'react'

import {
  Wallet,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import {
  useAccount,
  useBalance,
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'

import { parseEther } from 'viem'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  const [recipient, setRecipient] = useState('')

  const [amount, setAmount] = useState('')

  const { address, isConnected } = useAccount()

  const chainId = useChainId()

  const { data: balance } = useBalance({
    address,
  })

  const {
    data: hash,
    isPending,
    sendTransaction,
  } = useSendTransaction()

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleSend = async () => {
    if (!recipient || !amount) return

    sendTransaction({
      to: recipient as `0x${string}`,
      value: parseEther(amount),
    })
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-8 h-8 text-green-400" />

          <div>
            <h1 className="text-3xl font-bold">
              Day 03 🚀
            </h1>

            <p className="text-zinc-400 text-sm">
              Send ETH App
            </p>
          </div>
        </div>

        <div className="mb-6">
          <ConnectButton />
        </div>

        {isConnected ? (
          <div className="space-y-4">

            <div className="rounded-2xl bg-zinc-800 p-4">
              <p className="text-zinc-400 text-sm mb-1">
                Wallet Balance
              </p>

              <p className="text-2xl font-bold">
                {balance?.formatted.slice(0, 6)} {balance?.symbol}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-800 p-4">
              <p className="text-zinc-400 text-sm mb-2">
                Recipient Address
              </p>

              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-xl bg-black border border-zinc-700 p-3 outline-none"
              />
            </div>

            <div className="rounded-2xl bg-zinc-800 p-4">
              <p className="text-zinc-400 text-sm mb-2">
                Amount (ETH)
              </p>

              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                className="w-full rounded-xl bg-black border border-zinc-700 p-3 outline-none"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={isPending}
              className="w-full rounded-2xl bg-green-500 hover:bg-green-400 transition p-4 font-bold text-black flex items-center justify-center gap-2"
            >

              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send ETH
                </>
              )}

            </button>

            {isSuccess && (
              <div className="rounded-2xl bg-green-500/20 border border-green-500 p-4 flex items-center gap-3">

                <CheckCircle2 className="text-green-400" />

                <div>
                  <p className="font-bold text-green-400">
                    Transaction Successful
                  </p>

                  <p className="text-sm break-all">
                    {hash}
                  </p>
                </div>

              </div>
            )}

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