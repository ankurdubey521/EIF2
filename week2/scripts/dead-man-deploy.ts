const deadManDeploy = async () => {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Factory = await ethers.getContractFactory("DeadManSwitch");
    const contract = await Factory.deploy("0x875D25Ee4bC604C71BaF6236a8488F22399BED4b");
  
    console.log("Contract address:", contract.address);
  };
  
  deadManDeploy()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  