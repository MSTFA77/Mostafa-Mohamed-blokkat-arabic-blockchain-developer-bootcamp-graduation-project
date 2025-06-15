📜 Smart Contract
✅ Features
constructor() sets the deployer as the owner and configures the Chainlink price feed

getETHAmountFor50USD(): calculates how much ETH (in wei) is needed to equal $50

withdraw50USDInETH(): allows the owner to withdraw that amount, if balance permits

receive(): enables the contract to accept ETH deposits from anyone

🧠 Key Logic
solidity
uint256 ethAmount = (50 * 1e26) / uint256(price); // $50 in ETH using 8 decimal Chainlink price
🔗 Chainlink Price Feed

Network: Scroll Sepolia

ETH/USD Price Feed Address: 0x59F1ec1f10bD7eD9B938431086bC1D9e233ECf41

Decimals: 8

🧪 Testing
Testing framework: Foundry

✅ Covered Scenarios:
Owner correctly set on deployment

Accurate ETH amount for $50 based on mock Chainlink feed

Withdraw succeeds with sufficient contract balance

Withdraw fails if called by non-owner

Withdraw fails if balance is insufficient

ETH received correctly via receive()

Fails gracefully if price feed is invalid (0)

🧪 Mocking Chainlink
MockPriceFeed is injected by direct storage override:

solidity

vm.store(address(usdWithdrawer), bytes32(0), bytes32(uint256(uint160(address(mockFeed)))));
📁 Test file: test/USDWithdrawer.t.sol

🔒 Design & Security
✅ Design Requirements
Minimalist smart contract with clear responsibility separation

Secure owner-only access to critical withdrawal function

🛡️ Security Measures
onlyOwner enforcement using require

Price feed validation (require(price > 0))

Withdrawal only permitted if contract has enough balance

Receive function guarded by no logic = safer from misuse

📚 Natspec Docs
Smart contract is annotated with Solidity NatSpec:

@notice, @param, @return, @dev
