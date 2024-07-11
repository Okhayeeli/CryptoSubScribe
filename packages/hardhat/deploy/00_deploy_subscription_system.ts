import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deploySubscriptionManager: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying from account:", deployer);

  const subscriptionManager = await deploy("SubscriptionManager", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log("SubscriptionManager deployed to:", subscriptionManager.address);

  const SubscriptionManager = await hre.ethers.getContract<Contract>("SubscriptionManager", deployer);

  // Define subscriptions
  const subscriptions = [
    { name: "Rent", price: hre.ethers.parseEther("0.005"), duration: 30 * 24 * 60 * 60 },
    { name: "Utilities", price: hre.ethers.parseEther("0.002"), duration: 30 * 24 * 60 * 60 },
    { name: "Internet", price: hre.ethers.parseEther("0.005"), duration: 30 * 24 * 60 * 60 },
    { name: "Streaming", price: hre.ethers.parseEther("0.0015"), duration: 30 * 24 * 60 * 60 },
    { name: "Gym", price: hre.ethers.parseEther("0.4"), duration: 30 * 24 * 60 * 60 },
    { name: "Food Delivery", price: hre.ethers.parseEther("0.001"), duration: 30 * 24 * 60 * 60 },
    { name: "Mobile Plan", price: hre.ethers.parseEther("0.006"), duration: 30 * 24 * 60 * 60 },
  ];

  for (const sub of subscriptions) {
    await SubscriptionManager.addSubscription(sub.name, sub.price, sub.duration);
    console.log(`Added subscription: ${sub.name}`);
  }

  const owner = await SubscriptionManager.owner();
  console.log("Contract owner:", owner);
};

export default deploySubscriptionManager;
deploySubscriptionManager.tags = ["SubscriptionManager"];
