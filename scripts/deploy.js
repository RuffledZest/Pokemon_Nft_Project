const hre = require("hardhat");

async function main() {
  const initBalance = 10;
  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(initBalance);
  await assessment.deployed();

  console.log(`NFT Marketplace contract deployed to ${assessment.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
