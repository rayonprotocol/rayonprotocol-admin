module.exports = async function (
  { owner,
    borrowerApp1, borrowerApp2, borrowerApp3,
    borrower1, borrower2, borrower3, borrower4, borrower5,
  }, // addresses
  web3, // web3 instance
  { getContractFromRegistry, logTx }, // utils
) {
  const PersonalDataList = await getContractFromRegistry('personaldata/PersonalDataList');
  const PersonalDataCategory = await getContractFromRegistry('personaldata/PersonalDataCategory');
  const BorrowerApp = await getContractFromRegistry('borrower/BorrowerApp');
  const Borrower = await getContractFromRegistry('borrower/Borrower');

  const dataList = [
    {
      code: 20101,
      borrowerAppId: borrowerApp1,
      borrowerId: borrower1,
      dataHash: web3.utils.sha3('2000000'),
    }, {
      code: 20101,
      borrowerAppId: borrowerApp1,
      borrowerId: borrower2,
      dataHash: web3.utils.sha3('2500000'),
    }, {
      code: 20101,
      borrowerAppId: borrowerApp1,
      borrowerId: borrower3,
      dataHash: web3.utils.sha3('3000000'),
    }, {
      code: 20102,
      borrowerAppId: borrowerApp1,
      borrowerId: borrower3,
      dataHash: web3.utils.sha3('200000000'),
    }, {
      code: 20102,
      borrowerAppId: borrowerApp1,
      borrowerId: borrower4,
      dataHash: web3.utils.sha3('40000000'),
    }, {
      code: 20102,
      borrowerAppId: borrowerApp1,
      borrowerId: borrower5,
      dataHash: web3.utils.sha3('80000000'),
    }, {
      code: 20103,
      borrowerAppId: borrowerApp1,
      borrowerId: borrower1,
      dataHash: web3.utils.sha3('400000000'),
    }, {
      code: 20103,
      borrowerAppId: borrowerApp1,
      borrowerId: borrower2,
      dataHash: web3.utils.sha3('700000000'),
    }, {
      code: 20103,
      borrowerAppId: borrowerApp1,
      borrowerId: borrower4,
      dataHash: web3.utils.sha3('300000000'),
    }, {
      code: 20103,
      borrowerAppId: borrowerApp1,
      borrowerId: borrower5,
      dataHash: web3.utils.sha3('120000000'),
    }, {
      code: 30100,
      borrowerAppId: borrowerApp2,
      borrowerId: borrower2,
      dataHash: web3.utils.sha3('10000000000'),
    }, {
      code: 30100,
      borrowerAppId: borrowerApp2,
      borrowerId: borrower3,
      dataHash: web3.utils.sha3('1500000000'),
    }, {
      code: 30100,
      borrowerAppId: borrowerApp2,
      borrowerId: borrower4,
      dataHash: web3.utils.sha3('80000000'),
    }, {
      code: 30200,
      borrowerAppId: borrowerApp2,
      borrowerId: borrower5,
      dataHash: web3.utils.sha3('4000000'),
    }, {
      code: 30200,
      borrowerAppId: borrowerApp2,
      borrowerId: borrower1,
      dataHash: web3.utils.sha3('2300000'),
    }, {
      code: 30200,
      borrowerAppId: borrowerApp2,
      borrowerId: borrower2,
      dataHash: web3.utils.sha3('1100000'),
    }, {
      code: 40100,
      borrowerAppId: borrowerApp3,
      borrowerId: borrower1,
      dataHash: web3.utils.sha3('2000000'),
    }, {
      code: 40100,
      borrowerAppId: borrowerApp3,
      borrowerId: borrower2,
      dataHash: web3.utils.sha3('3000000'),
    }, {
      code: 40100,
      borrowerAppId: borrowerApp3,
      borrowerId: borrower3,
      dataHash: web3.utils.sha3('5000000'),
    }, {
      code: 40100,
      borrowerAppId: borrowerApp3,
      borrowerId: borrower4,
      dataHash: web3.utils.sha3('7000000'),
    }, {
      code: 40100,
      borrowerAppId: borrowerApp3,
      borrowerId: borrower5,
      dataHash: web3.utils.sha3('10000000'),
    },
  ];

  await logTx(
    PersonalDataList.methods.setBorrowerAppContractAddress(BorrowerApp.options.address)
      .send({ from: owner }),
    `BorrowerApp: ${BorrowerApp.options.address}`
  );

  await logTx(
    PersonalDataList.methods.setBorrowerContractAddress(Borrower.options.address)
      .send({ from: owner }),
    `Borrower: ${Borrower.options.address}`
  );

  await logTx(
    PersonalDataList.methods.setPersonalDataCategoryContractAddress(PersonalDataCategory.options.address)
      .send({ from: owner }),
    `PersonalDataCategory: ${PersonalDataCategory.options.address}`
  );

  for (const data of dataList) {
    const { code, borrowerAppId, borrowerId, dataHash } = data;
    await logTx(
      PersonalDataList.methods.add(borrowerId, code, dataHash)
        .send({ from: borrowerAppId }),
      `borrower: ${borrowerId}, borrowerApp: ${borrowerAppId}, code: ${code}`
    );
  }
};
