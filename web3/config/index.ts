import { cookieStorage, createStorage } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { Chain } from 'viem'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID 

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Scroll Sepolia Testnet
export const scrollSepolia: Chain = {
  id: 534351,
  name: 'Scroll Sepolia Testnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://534351.rpc.thirdweb.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'ScrollScan',
      url: 'https://sepolia.scrollscan.com'
    }
  },
  testnet: true
}

// Only Scroll Sepolia
export const networks = [scrollSepolia]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig