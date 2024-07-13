
// config/index.tsx

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia, baseSepolia , base} from 'wagmi/chains'

// Your WalletConnect Cloud project ID
export const projectId = 'b8e55f313fe6c16ae34f4fbeb9bc48e1'

// Create a metadata object
const metadata = {
  name: 'Threer',
  description: 'Best Onchain Marketplace for devs',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
const chains = [mainnet, sepolia, baseSepolia, base] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  auth: {
    email: true, // default to true
    socials: ['google', 'x', 'github', 'discord', 'apple'],
    showWallets: true, // default to true
    walletFeatures: true // default to true
  }

})