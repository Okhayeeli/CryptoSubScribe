# 🏗 Crypto-Subscribe

  CryptoSubScribe is a decentralized subscription management platform built on Ethereum using Scaffold-ETH. It allows users to create and manage batch cryptocurrency-based subscriptions, leveraging state channels for opening and batching two or more subscriptions, paying less gas fees. 

## Features
  🌐 State Channels: should utilize Ethereum state channels to manage subscriptions off-chain, reducing transaction costs and latency. But in this case no off-chain transaction was incorporated, rather, I used the state channel to batch  and pay for all or some subscriptions all at once
  💸 Subscription Payments: Pay for subscriptions with deposited ETH, ensuring quick and cost-effective transactions.

  # ⏱️ Future implementation of State Channels:
  Duration Calculation: Calculate subscription durations off-chain to streamline user experience.
  Off-chain Messaging: Explore using web3 to send messages without gas fees, enhancing usability.
  🎮 Potential for Gaming: Consider extending state channel functionality to gaming and interactive applications for real-time, feeless transactions or I could  be wrong.


Before you begin, you need to install the following tools:

Node (>= v18.17)
Yarn (v1 or v2+)
Git

Clone this repo & install dependencies

```
git clone https://github.com/Okhayeeli/CryptoSubScribe.git
cd CryptoSubScribe
git checkout CryptoSubScribe
yarn install
```
 In the same terminal, 🛰 deploy  contract(sepolia). You can customize the network configuration in `hardhat.config.ts`, you can change it to `localhost` to test with faucet.:
```
yarn deploy
```
This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a second terminal, start your NextJS app:

```
cd CryptoSubScribe
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.

## Using CryptoSubScribe
 Opening a State Channel:
    - Deposit ETH to open a state channel.
    - Utilize the channel to manage multiple subscriptions.

 Paying for Subscriptions:
    - Use the deposited ETH to pay for two or more subscribed services and pay less for gas.

 Future Enhancements:
     - Duration Calculation: Implement off-chain duration calculation to automate subscription management.
     - Off-chain Messaging: Integrate web3 to enable feeless communication for enhanced user interactions.

## Thoughts
When it comes to building on the Ethereum blockchain, considering not rebuidling just any app built with web2 technologies would do better for web3 use case. This was trial given to be by buidl-guidl, I hope to do better with use-cases preferably suitable for the Ethereum blockchain.
## Acknowledgments
     Scaffold-ETH for providing a robust framework for Ethereum development.
     The Ethereum community for continuous support and development.
