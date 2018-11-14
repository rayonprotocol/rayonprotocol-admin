module.exports = async function (
  { owner, attester }, // addresses
  web3, // web3 instance
  { getContract, logDone, logError }, // utils
) {
  const kycAttester = getContract('kyc/KycAttester');
  const description = `attester: ${attester}`;

  await kycAttester.methods.add(attester, 'RayonAttester')
    .send({ from: owner })
    .then(logDone.bind(logDone, description))
    .catch(logError.bind(logError, description));
}