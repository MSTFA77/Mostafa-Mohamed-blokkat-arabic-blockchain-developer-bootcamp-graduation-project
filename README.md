# 💸 ETH Withdrawal DApp

A decentralized application (DApp) that allows the owner to withdraw the equivalent of \$50 in ETH, and users to deposit ETH into the contract. Built with **Solidity**, **Next.js**, **Wagmi**, and deployed to **Scroll Sepolia Testnet**.
---

## 🚀 Hosting

* Smart contract hosted on Scroll Sepolia
* Frontend hosted on **Vercel**

  * Link: [Vercel Frontend](https://web3-73j241laf-mstfa77s-projects.vercel.app/)

---
---

## 📦 Table of Contents

* [🎯 Project Goals](#-project-goals)
* [🔗 Contract Info](#-contract-info)
* [🧪 Smart Contract Tests](#-smart-contract-tests)
* [🖥️ Frontend](#%EF%B8%8F-frontend)
* [🔌 Wagmi Integration](#-wagmi-integration)
* [🚀 Hosting](#-hosting)
* [🧠 Design Considerations & Security](#-design-considerations--security)
* [📜 Natspec Documentation](#-natspec-documentation)

---

## 🎯 Project Goals

* Build and deploy a smart contract that:

  * Accepts ETH deposits
  * Allows owner to withdraw \$50 worth of ETH
* Build a frontend UI to:

  * Connect wallet
  * Display data from the contract
  * Send transactions and update the contract state

---

## 🔗 Contract Info

* **Address**: `0xE7289411Cbb84CAa98857b9725A9F993427f8590`
* **Network**: Scroll Sepolia Testnet
* **Explorer**: [ScrollScan](https://sepolia.scrollscan.com/address/0xE7289411Cbb84CAa98857b9725A9F993427f8590)
* **Faucet**: [Get Scroll ETH](https://docs.scroll.io/en/user-guide/faucet/)
* **Add Scroll Sepolia**: [Add to MetaMask](https://docs.scroll.io/en/developers/developer-quickstart/#scroll-sepolia-testnet)

---

## 🧪 Smart Contract Tests 

Location: `/test`

* ✅ Includes **5 unit tests** targeting contract functions
* ✅ Each test has a comment explaining what it verifies
* ✅ Tests focus on:

  * Deposit behavior
  * Owner-only withdrawal
  * ETH amount calculation logic
  * Access control
  * Fallback & receive support

---

## 🖥️ Frontend

Location: `/frontend`

* Built using **React (Next.js)** with **Tailwind CSS**
* ✅ Detects and connects to MetaMask
* ✅ Displays current user address
* ✅ Reads live contract data:

  * Contract balance
  * ETH equivalent of \$50
* ✅ Sends transactions to:

  * Deposit ETH
  * Withdraw (only if owner)
* ✅ Updates UI after transaction success

Live Demo: 🌍 [https://web3-73j241laf-mstfa77s-projects.vercel.app/](https://mostafa-mohamed-blokkat-arabic-bloc.vercel.app/)

---

## 🔌 Wagmi Integration

* Used **Wagmi** to:

  * Send transactions to Scroll Sepolia RPC node
  * Detect and connect to MetaMask
  * Interact with smart contract functions
  * Listen to smart contract events (future expansion)

---

## 🚀 Hosting

* Smart contract hosted on Scroll Sepolia
* Frontend hosted on **Vercel**

  * Link: [Vercel Frontend](https://web3-73j241laf-mstfa77s-projects.vercel.app/)

---

## 🧠 Design Considerations & Security

✔️ **Design Requirements Applied** ([Source](https://docs.google.com/document/d/1BP4V3kXStbRSbvqIZh2rsp5oe8w09baKgja4zJpN0rk)):

1. Separation of concerns (contract logic & UI isolated)
2. Clear ownership access control

🛡️ **Security Precautions Applied**:

1. `onlyOwner` restriction on `withdraw50USDInETH`
2. Uses `receive()` for ETH deposits

---

## 📜 Natspec Documentation

* All Solidity functions are documented using the [NatSpec standard](https://docs.soliditylang.org/en/latest/natspec-format.html)

  * `@notice` explains usage
  * `@param` and `@return` used where needed

Example:

```solidity
/**
 * @notice Allows the owner to withdraw 50 USD worth of ETH
 * @dev Uses Chainlink price feed to get ETH/USD rate
 */
function withdraw50USDInETH() external onlyOwner {
  // ...
}
```

---

## 🛠️ Tech Stack

* **Solidity**
* **Hardhat** for development and testing
* **Next.js** (App Router)
* **Wagmi + Ethers.js** for blockchain interactions
* **Tailwind CSS** for styling
* **Vercel** for deployment

---

## 📬 Contact

For any issues or questions, please open an issue or reach out via GitHub.
or my Mail :
mostafamohamed267745@gmail.com

---

**This project was built as part of a Blockchain Developer Bootcamp and fulfills all required submission criteria.**
 
