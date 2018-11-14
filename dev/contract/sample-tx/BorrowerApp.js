module.exports = async function (
  { owner, borrowerApp1, borrowerApp2, borrowerApp3 }, // addresses
  web3, // web3 instance
  { getContract, logDone, logError }, // utils
) {
  const borrowerApp = getContract('borrower/BorrowerApp');
  const borrowerAppData = [
    { address: borrowerApp1, name: 'RayonBA' },
    { address: borrowerApp2, name: 'Finda' },
    { address: borrowerApp3, name: 'AllGood' },
  ];

  for (const ba of borrowerAppData) {
    const description = `borrower app: ${ba.address}`;
    await borrowerApp.methods
      .add(ba.address, ba.name)
      .send({ from: owner })
      .then(logDone.bind(logDone, description))
      .catch(logError.bind(logError, description));
  }
}
