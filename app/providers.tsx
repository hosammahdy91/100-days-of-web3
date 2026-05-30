'use client'

import '@rainbow-me/rainbowkit/styles.css'

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'

import { WagmiProvider } from 'wagmi'

import {
  mainnet,
  base,
  arbitrum,
  polygon,
  optimism,
} from 'wagmi/chains'

import {
  QueryClientProvider,
  QueryClient,
} from '@tanstack/react-query'

const config = getDefaultConfig({
  appName: '100 Days of Web3',
  projectId: '697954beac9445159214a7ccfc4b81c1',
  chains: [
    mainnet,
    base,
    arbitrum,
    polygon,
    optimism,
  ],
})

const queryClient = new QueryClient()

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}