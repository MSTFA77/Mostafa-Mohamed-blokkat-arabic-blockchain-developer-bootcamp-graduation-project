"use client"
import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

export default function Home() {
  // State for client-side checking
  const [isClient, setIsClient] = useState(false)
  
  // Contract configuration
  const contractAddress = "0xE7289411Cbb84CAa98857b9725A9F993427f8590"
  const contractABI = [
    {"type":"constructor","inputs":[],"stateMutability":"nonpayable"},
    {"type":"receive","stateMutability":"payable"},
    {"type":"function","name":"getETHAmountFor50USD","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
    {"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address payable"}],"stateMutability":"view"},
    {"type":"function","name":"withdraw50USDInETH","inputs":[],"outputs":[],"stateMutability":"nonpayable"}
  ]

  // State management
  const [account, setAccount] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [ethAmount, setEthAmount] = useState("0")
  const [balance, setBalance] = useState("0")
  const [loading, setLoading] = useState(false)
  const [depositAmount, setDepositAmount] = useState("0")

  // Add new state for better UX
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Helper function to connect wallet
  const connectWallet = useCallback(async () => {
    if (!isClient || !window.ethereum) throw new Error("No Ethereum provider found")
    
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    return provider.getSigner()
  }, [isClient])

  // Helper function to get contract instance
  const getContract = useCallback((provider: ethers.providers.Web3Provider) => {
    return new ethers.Contract(contractAddress, contractABI, provider.getSigner())
  }, [])

  // Check if current account is owner
  const checkOwner = useCallback(async (address: string) => {
    if (!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = getContract(provider)
    const owner = await contract.owner()
    setIsOwner(owner.toLowerCase() === address.toLowerCase())
  }, [getContract])

  // Get current ETH amount for 50 USD
  const getETHAmount = useCallback(async () => {
    if (!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = getContract(provider)
    const amount = await contract.getETHAmountFor50USD()
    setEthAmount(ethers.utils.formatEther(amount))
  }, [getContract])

  // Get contract balance
  const getBalance = useCallback(async () => {
    if (!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    setBalance(ethers.utils.formatEther(balance))
  }, [])

  // Check if wallet is connected
  const checkWallet = useCallback(async () => {
    if (!isClient || !window.ethereum) return
    
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.listAccounts()
    if (accounts.length > 0) {
      setAccount(accounts[0])
      checkOwner(accounts[0])
    }
  }, [isClient, checkOwner])

  // Helper function to show notifications
  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(message)
      setError(null)
    } else {
      setError(message)
      setSuccess(null)
    }
    setTimeout(() => {
      setSuccess(null)
      setError(null)
    }, 5000)
  }, [])

  // Update handleConnect with better error handling
  const handleConnect = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const signer = await connectWallet()
      const address = await signer.getAddress()
      setAccount(address)
      checkOwner(address)
      showNotification('Wallet connected successfully!', 'success')
    } catch (error) {
      console.error(error)
      showNotification('Failed to connect wallet. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }, [connectWallet, checkOwner, showNotification])

  // Update handleDeposit with better feedback
  const handleDeposit = useCallback(async () => {
    try {
      setIsProcessing(true)
      setError(null)
      const signer = await connectWallet()
      const tx = await signer.sendTransaction({
        to: contractAddress,
        value: ethers.utils.parseEther(depositAmount),
      })
      showNotification('Transaction sent! Waiting for confirmation...', 'success')
      await tx.wait()
      showNotification('Deposit successful!', 'success')
      getBalance()
    } catch (error) {
      console.error(error)
      showNotification('Failed to deposit. Please try again.', 'error')
    } finally {
      setIsProcessing(false)
    }
  }, [connectWallet, depositAmount, getBalance, showNotification])

  // Update handleWithdraw with better feedback
  const handleWithdraw = useCallback(async () => {
    try {
      setIsProcessing(true)
      setError(null)
      const signer = await connectWallet()
      const contract = getContract(new ethers.providers.Web3Provider(window.ethereum!))
      const tx = await contract.withdraw50USDInETH()
      showNotification('Withdrawal transaction sent! Waiting for confirmation...', 'success')
      await tx.wait()
      showNotification('Withdrawal successful!', 'success')
      getBalance()
    } catch (error) {
      console.error(error)
      showNotification('Failed to withdraw. Please try again.', 'error')
    } finally {
      setIsProcessing(false)
    }
  }, [connectWallet, getContract, getBalance, showNotification])

  // Initialize - runs only on client side
  useEffect(() => {
    if (!isClient) return

    checkWallet()
    getETHAmount()
    getBalance()

    if (window.ethereum && typeof window.ethereum.on === 'function') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null)
          setIsOwner(false)
        } else {
          setAccount(accounts[0])
          checkOwner(accounts[0])
        }
      })
    }

    return () => {
      if (window.ethereum && typeof window.ethereum.removeListener === 'function') {
        window.ethereum.removeListener('accountsChanged', () => {})
      }
    }
  }, [isClient, checkWallet, getETHAmount, getBalance, checkOwner])

  // Render loading state during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-4xl mx-auto py-4 px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">ETH Withdrawal</h1>
          </div>
        </header>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ETH Withdrawal DApp</h1>
          
          {account ? (
            <div className="flex items-center gap-3">
              <span className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              {isOwner && (
                <span className="text-sm bg-green-50 text-green-700 px-3 py-2 rounded-full font-medium">
                  Owner
                </span>
              )}
            </div>
          ) : (
            <button 
              onClick={handleConnect}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 font-medium"
              suppressHydrationWarning
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </header>

      {/* Notifications */}
      {(error || success) && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700">{success}</p>
            </div>
          )}
        </div>
      )}

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Contract Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Contract Balance</p>
              <p className="text-2xl font-bold text-gray-900">{balance} ETH</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">50 USD in ETH</p>
              <p className="text-2xl font-bold text-gray-900">{ethAmount} ETH</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Deposit ETH</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="deposit" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (ETH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="deposit"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.001"
                    min="0.001"
                    placeholder="Enter amount in ETH"
                    suppressHydrationWarning
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">ETH</span>
                </div>
              </div>
              <button
                onClick={handleDeposit}
                disabled={!account || isProcessing}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200 font-medium"
              >
                {isProcessing ? 'Processing...' : 'Deposit ETH'}
              </button>
            </div>
          </div>

          {isOwner && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Withdraw 50 USD</h2>
              <div className="space-y-6">
                <p className="text-sm text-gray-600">
                  As the contract owner, you can withdraw the equivalent of 50 USD in ETH.
                  Current value: {ethAmount} ETH
                </p>
                <button
                  onClick={handleWithdraw}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 font-medium"
                >
                  {isProcessing ? 'Processing...' : 'Withdraw 50 USD'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}