module.exports = async function (
  { owner, borrowerApp1, borrowerApp2, borrowerApp3 }, // addresses
  web3, // web3 instance
  { getContractFromRegistry, logTx }, // utils
) {
  const borrowerApp = await getContractFromRegistry('borrower/BorrowerApp');
  const borrowerAppData = [
    { address: borrowerApp1, name: 'RayonBA' },
    { address: borrowerApp2, name: 'Finda' },
    { address: borrowerApp3, name: 'AllGood' },
  ];

  for (const ba of borrowerAppData) {
    const description = `borrower app: ${ba.address}`;
    await logTx(
      borrowerApp.methods.add(ba.address, ba.name).send({ from: owner }),
      description
    );
  }
};
