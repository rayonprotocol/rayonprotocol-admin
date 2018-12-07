module.exports = async function (
  { owner }, // addresses
  web3, // web3 instance
  {
    deployContract,
    getContractFromRegistry,
    getContract,
    logTx,
  }, // utils
) {
  const Registry = getContract('registry/Registry');
  const Auth = getContract('kyc/Auth');
  const KycAttester = getContract('kyc/KycAttester');
  const BorrowerApp = getContract('borrower/BorrowerApp');
  const Borrower = getContract('borrower/Borrower');
  const BorrowerMember = getContract('borrower/BorrowerMember');
  const PersonalDataList = getContract('personaldata/PersonalDataList');
  const PersonalDataCategory = getContract('personaldata/PersonalDataCategory');
  const contracts = {
    Auth, KycAttester, BorrowerApp, Borrower, BorrowerMember, PersonalDataList, PersonalDataCategory,
  };

  const deplyProxy = (contractName) => new Promise((resolve, reject) => {
    let receipt;
    const deployTx = deployContract('common/RayonProxy', [contractName]);
    return deployTx.send({ from: owner })
      .once('receipt', function (deployReceipt) {
        receipt = deployReceipt;
      }).then(instance => {
        resolve({ receipt, instance });
      });
  });

  for (const contractName in contracts) {
    const Contract = contracts[contractName];
    const proxyDeployment = await deplyProxy(contractName);
    if (!proxyDeployment) return;
    const { instance: AnotherProxy, receipt: proxyReceipt } = proxyDeployment;
    // Register proxy
    await logTx(
      Registry.methods.register(AnotherProxy.options.address, proxyReceipt.blockNumber).send({ from: owner }),
      `Proxy: ${AnotherProxy.options.address}, blockNumber: ${proxyReceipt.blockNumber}`
    );
    // Set Proxy's target logic contract address
    await logTx(
      AnotherProxy.methods.setTargetAddress(Contract.options.address).send({ from: owner }),
      `Contract(${contractName}): ${Contract.options.address}`
    );
    // await logTx(
    //   Registry.methods.upgrade(Contract.options.address).send({ from: owner }),
    //   `Contract(${contractName}): ${Contract.options.address}`
    // );
  }
};
