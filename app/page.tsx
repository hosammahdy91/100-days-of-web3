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
  useWriteContract,
  useWaitForTransactionReceipt,
  useSendTransaction,
} from 'wagmi'

import {
  parseUnits,
  parseEther,
} from 'viem'

const USDC_ADDRESSES: Record<number, `0x${string}`> = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  10: '0x0b2C639c533813f4Aa9D7837CaF62653d097Ff85',
  137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  8453: '0x833589fCD6EDB6E08f4c7C32D4f71b54bdA02913',
}

const ERC20_ABI = [
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
  },
] as const

export default function Home() {
  const [mounted, setMounted] = useState(false)

  const [recipient, setRecipient] = useState('')

  const [amount, setAmount] = useState('')

  const [asset, setAsset] =
    useState<'ETH' | 'USDC'>('ETH')

  const { address, isConnected } = useAccount()

  const chainId = useChainId()

  const { data: balance } = useBalance({
    address,
  })

  const {
    data: usdcHash,
    isPending: usdcPending,
    writeContract,
  } = useWriteContract()

  const {
    data: ethHash,
    isPending: ethPending,
    sendTransaction,
  } = useSendTransaction()

  const currentHash =
    usdcHash || ethHash

  const { isSuccess } =
    useWaitForTransactionReceipt({
      hash: currentHash,
    })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const usdcAddress =
    USDC_ADDRESSES[chainId]

  const handleSendETH = () => {
    if (!recipient || !amount) return

    sendTransaction({
      to: recipient as `0x${string}`,
      value: parseEther(amount),
    })
  }

  const handleSendUSDC = () => {
    if (!recipient || !amount) return

    if (!usdcAddress) {
      alert('Network not supported')
      return
    }

    writeContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [
        recipient as `0x${string}`,
        parseUnits(amount, 6),
      ],
    })
  }

  const handleSend = () => {
    if (asset === 'ETH') {
      handleSendETH()
      return
    }

    if (asset === 'USDC') {
      handleSendUSDC()
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-8 h-8 text-green-400" />

          <div>
            <h1 className="text-3xl font-bold">
              Day 05 🚀
            </h1>

            <p className="text-zinc-400 text-sm">
              Multi-Chain Asset Sender
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
                {balance?.formatted?.slice(0, 8)}{' '}
                {balance?.symbol}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-800 p-4">
              <p className="text-zinc-400 text-sm mb-1">
                Current Chain
              </p>

              <p className="text-xl font-bold">
                {chainId}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-800 p-4">
              <p className="text-zinc-400 text-sm mb-2">
                Asset
              </p>

              <select
                value={asset}
                onChange={(e) =>
                  setAsset(
                    e.target.value as
                      | 'ETH'
                      | 'USDC'
                  )
                }
                className="w-full rounded-xl bg-black border border-zinc-700 p-3"
              >
                <option value="ETH">
                  ETH
                </option>

                <option value="USDC">
                  USDC
                </option>
              </select>
            </div>

            <div className="rounded-2xl bg-zinc-800 p-4">
              <p className="text-zinc-400 text-sm mb-2">
                Recipient Address
              </p>

              <input
                value={recipient}
                onChange={(e) =>
                  setRecipient(
                    e.target.value
                  )
                }
                placeholder="0x..."
                className="w-full rounded-xl bg-black border border-zinc-700 p-3 outline-none"
              />
            </div>

            <div className="rounded-2xl bg-zinc-800 p-4">
              <p className="text-zinc-400 text-sm mb-2">
                Amount ({asset})
              </p>

              <input
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                placeholder={
                  asset === 'ETH'
                    ? '0.01'
                    : '10'
                }
                className="w-full rounded-xl bg-black border border-zinc-700 p-3 outline-none"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={
                usdcPending ||
                ethPending
              }
              className="w-full rounded-2xl bg-green-500 hover:bg-green-400 transition p-4 font-bold text-black flex items-center justify-center gap-2"
            >
              {usdcPending ||
              ethPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending {asset}...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send {asset}
                </>
              )}
            </button>

            {isSuccess && (
              <div className="rounded-2xl bg-green-500/20 border border-green-500 p-4 flex items-center gap-3">
                <CheckCircle2 className="text-green-400" />

                <div>
                  <p className="font-bold text-green-400">
                    {asset} Sent Successfully
                  </p>

                  <p className="text-sm break-all">
                    {currentHash}
                  </p>
                </div>
              </div>
            )}
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