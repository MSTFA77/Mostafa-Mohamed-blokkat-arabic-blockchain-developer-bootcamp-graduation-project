## 📜 Smart Contract

### ✅ Features

- `constructor()`  
  Sets the deployer as the **owner** and configures the **Chainlink ETH/USD price feed**.

- `getETHAmountFor50USD()`  
  Calculates how much **ETH (in wei)** is needed to equal **$50** based on the real-time price.

- `withdraw50USDInETH()`  
  Allows the **owner** to withdraw exactly $50 worth of ETH **if the contract has enough balance**.

- `receive()`  
  Enables the contract to **accept ETH deposits** from any user.

---

### 🧠 Key Logic

```solidity
uint256 ethAmount = (50 * 1e26) / uint256(price); // $50 in ETH using 8 decimal Chainlink price
````

---

### 🔗 Chainlink Price Feed

* **Network:** Scroll Sepolia
* **Feed:** ETH/USD
* **Address:** `0x59F1ec1f10bD7eD9B938431086bC1D9e233ECf41`
* **Decimals:** `8`

---

## 🧪 Testing

**Testing framework:** [Foundry](https://book.getfoundry.sh/)

### ✅ Covered Scenarios:

* Owner is correctly set on deployment
* Calculates ETH amount for \$50 accurately using mock Chainlink feed
* Withdraw succeeds if enough ETH is available
* Withdraw fails if:

  * Not called by owner
  * Insufficient contract balance
* ETH is correctly received using the `receive()` function
* Fails gracefully if the price feed returns an invalid (0) value

---

### 🧪 Mocking Chainlink

A mock Chainlink price feed is used in tests and injected into the deployed contract using **direct storage override**:

```solidity
vm.store(
    address(usdWithdrawer),
    bytes32(0), // storage slot for priceFeed
    bytes32(uint256(uint160(address(mockFeed))))
);
```

📄 Test file: `test/USDWithdrawer.t.sol`

---

## 🔒 Design & Security

### ✅ Design Principles

* Minimalist and focused contract
* Clear separation of concerns
* Critical logic restricted to the **owner only**

### 🛡️ Security Measures

* Access control using `require(msg.sender == owner)`
* Validates price from Chainlink feed (`require(price > 0)`)
* Ensures sufficient balance before withdrawal
* Fallback `receive()` function doesn't execute logic (just accepts ETH safely)

---

## 📚 Natspec Documentation

Each public/external function is annotated using [Solidity NatSpec](https://docs.soliditylang.org/en/v0.8.19/natspec-format.html):

* `@notice` — What the function does
* `@dev` — Technical info
* `@return` — What the function returns
* `@param` — For parameter descriptions

Example:

```solidity
/// @notice Get the amount of ETH (in wei) equivalent to 50 USD
/// @return Amount of ETH (in wei)
function getETHAmountFor50USD() public view returns (uint256) { ... }
```

```

---
