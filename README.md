# 🏗 Crypto-Subscribe

  CryptoSubScribe is a decentralized subscription management platform built on Ethereum using Scaffold-ETH. It allows users to create and manage cryptocurrency-based subscriptions, leveraging state channels for efficient, low-cost transactions. The platform includes a mock subscription provider to demonstrate functionality for services not yet accepting crypto payments.

## Features
  🌐 State Channels: Utilize Ethereum state channels to manage subscriptions off-chain, reducing transaction costs and latency.
  💸 Subscription Payments: Pay for subscriptions with deposited ETH, ensuring quick and cost-effective transactions.

  # ⏱️ Future Additions:
  Duration Calculation: Calculate subscription durations off-chain to streamline user experience.
       Off-chain Messaging: Explore using web3 to send messages without gas fees, enhancing usability.
       🎮 Potential for Gaming: Consider extending state channel functionality to gaming and interactive applications for real-time, feeless transactions.


Before you begin, you need to install the following tools:

Node (>= v18.17)
Yarn (v1 or v2+)
Git

1. Clone this repo & install dependencies

```
git clone https://github.com/Okhayeeli/CryptoSubScribe.git
cd CryptoSubScribe
git checkout CryptoSubScribe
yarn install
```

2. In the same terminal, start your local network (a local instance of a blockchain):
```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. In a second terminal window, 🛰 deploy your contract (locally):
```
cd CryptoSubScribe
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
cd CryptoSubScribe
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

**What's next**:

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/hardhat/deploy`
- Edit your smart contract test in: `packages/hardhat/test`. To run test use `yarn hardhat:test`

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.

## Using CryptoSubScribe
1. Opening a State Channel:
    1. Deposit ETH to open a state channel.
    2.   Utilize the channel to manage multiple subscriptions.

2. Paying for Subscriptions:
    1. Use the deposited ETH to pay for subscribed services without incurring excessive gas fees.

3. Future Enhancements:
     1. Duration Calculation: Implement off-chain duration calculation to automate subscription management.
     2. Off-chain Messaging: Integrate web3 to enable feeless communication for enhanced user interactions.

## milestone
  1. Is it possible to sign on the frontend and have the amount for a subscription deducted form the subscription manager??
  2. 
## Acknowledgments
     Scaffold-ETH for providing a robust framework for Ethereum development.
     The Ethereum community for continuous support and development.
