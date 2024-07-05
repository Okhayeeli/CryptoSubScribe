import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployMockServiceProvider: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const mockServiceProvider = await deploy("MockServiceProvider", {
    from: deployer,
    args: [],
    log: true,
  });

  // Deploy SimpleStateChannel contract
  const simpleStateChannel = await deploy("SimpleStateChannel", {
    from: deployer,
    args: [mockServiceProvider.address],
    log: true,
  });
  // Set state channel address in MockServiceProvider contract
  const mockServiceProviderContract = await hre.ethers.getContract<Contract>("MockServiceProvider", deployer);
  await mockServiceProviderContract.setStateChannelAddress(simpleStateChannel.address);

  // Add subscription types to MockServiceProvider contract
  const subscriptionTypes = [
    { name: "educateSub", fee: hre.ethers.parseEther("0.0005") },
    { name: "farmpointSub", fee: hre.ethers.parseEther("0.0006") },
  ];

  for (const sub of subscriptionTypes) {
    await mockServiceProviderContract.addSubscriptionType(sub.name, sub.fee);
    console.log(`Added subscription type: ${sub.name}`);
  }
};

export default deployMockServiceProvider;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployMockServiceProvider.tags = ["MockServiceProvider", "StateChannel"];
