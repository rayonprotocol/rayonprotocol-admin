module.exports = async function (
  { owner, attester }, // addresses
  web3, // web3 instance
  { getContract, logTx }, // utils
) {
  const kycAttester = getContract('kyc/KycAttester');
  const description = `attester: ${attester}`;

  await logTx(
    kycAttester.methods.add(attester, 'RayonAttester').send({ from: owner }),
    description
  );
}