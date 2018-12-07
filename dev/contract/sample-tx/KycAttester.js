module.exports = async function (
  { owner, attester }, // addresses
  web3, // web3 instance
  { getContractFromRegistry, logTx }, // utils
) {
  const kycAttester = await getContractFromRegistry('kyc/KycAttester');
  const description = `attester: ${attester}`;
  await logTx(
    kycAttester.methods.add(attester, 'RayonAttester2').send({ from: owner }),
    description
  );
}