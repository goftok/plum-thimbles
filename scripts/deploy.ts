import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Get the contract factory
    const ThimblesGame = await ethers.getContractFactory("ThimblesGame");

    // Deploy the contract
    const thimblesGame = await ThimblesGame.deploy();

    // Wait for the deployment transaction to be mined
    await thimblesGame.waitForDeployment();

    console.log("ThimblesGame contract deployed to:", (await thimblesGame.getAddress()).toString());
  } catch (error) {
    console.error("Error deploying contract:", error);
    process.exit(1);
  }
}

// Run the main function
main().then(() => process.exit(0)).catch((error) => {
  console.error("Error in main function:", error);
  process.exit(1);
});
