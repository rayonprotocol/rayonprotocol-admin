module.exports = async function (
  { owner, borrowerApp1, borrowerApp2, borrower1, borrower2, borrower3, borrower4, borrower5 }, // addresses
  web3, // web3 instance
  { getContractFromRegistry, logTx }, // utils
) {
  const Auth = await getContractFromRegistry('kyc/Auth');
  const BorrowerApp = await getContractFromRegistry('borrower/BorrowerApp');
  const Borrower = await getContractFromRegistry('borrower/Borrower');

  const authSettingDescription = `Auth: ${Auth.options.address}`;
  await await logTx(
    Borrower.methods.setAuthContractAddress(Auth.options.address).send({ from: owner }),
    authSettingDescription
  );

  const borrowerAppSettingDescription = `BorrowerApp: ${BorrowerApp.options.address}`;
  await logTx(
    Borrower.methods.setBorrowerAppContractAddress(BorrowerApp.options.address).send({ from: owner }),
    borrowerAppSettingDescription
  );

  const borrowersForBorrowerApps = [
    {
      address: borrowerApp1,
      borrowers: [
        {
          address: borrower1,
          v: 27,
          r: '0xe39aeb9aa4c50d2a6881489a24e103822eb66c8dc47220d76fba8e68ce3cad0b',
          s: '0x75219c31095904f848cf5cc0d096efb056556e95db8d0f6a381019aff22c1bee',
        },
        {
          address: borrower2,
          v: 28,
          r: '0xddccc57581d15525de13c9cef9e656fa202e3ba9c0f54952ed456089580c634f',
          s: '0x5b15cf83cf3a41c081f076d98ecc4067fe758a29856ca60300e835509eea987d',
        },
        {
          address: borrower3,
          v: 27,
          r: '0x93e44805097e2dad6eb1bb70476138f05583b23e9a2affa1bbdb7dae70ba9bca',
          s: '0x721feeae7178352e841fe83c69f5eb06ab2f802299aec9d5a93f67c131b7596a',
        },
      ],
    },
    {
      address: borrowerApp2,
      borrowers: [
        {
          address: borrower4,
          v: 28,
          r: '0x789b13e559426c59ca46bc775cd259c70c79158b7062b7e75f44153dbfc9dc63',
          s: '0x1dda1651b045e47c6eff8148730144f161226022eb967397fb2723e689e591b6',
        },
        {
          address: borrower5,
          v: 27,
          r: '0x84405a141eb28e4062def544a7df15357a21371a4d9057cf331c03d8bed1cdec',
          s: '0x1ca990e2920a5e5ad051e29ff9b35e4d8ffc8f4a62c7eb587e926ffa248dfd34',
        },
      ],
    },
  ];

  for (const borrowerApp of borrowersForBorrowerApps) {
    for (const borrowerAndSig of borrowerApp.borrowers) {
      const { address: borrowerAddress, v, r, s } = borrowerAndSig;
      const description = `borrower: ${borrowerAddress}, borrower app: ${borrowerApp.address}`;
      await logTx(
        Borrower.methods.add(borrowerAddress, v, r, s).send({ from: borrowerApp.address }),
        description
      );
    }
  }
};
