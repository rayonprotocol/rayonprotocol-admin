module.exports = async function (
  { owner,
    borrowerApp1,
    borrowerApp2,
    borrowerApp3,
  }, // addresses
  web3, // web3 instance
  { getContractFromRegistry, logTx }, // utils
) {
  const PersonalDataCategory = await getContractFromRegistry('personaldata/PersonalDataCategory');
  const BorrowerApp = await getContractFromRegistry('borrower/BorrowerApp');
  const REWARD_CYCLE = {
    DAILY: 0,
    WEEKLY: 1,
    MONTHLY: 2,
    ANNUALLY: 3,
  };

  const categories = [
    {
      code: 20101,
      category1: 'Personal Income',
      category2: 'National Tax Service',
      category3: 'Earned Income Tax',
      borrowerAppId: borrowerApp1,
      score: 200,
      rewardCycle: REWARD_CYCLE.WEEKLY,
    }, {
      code: 20102,
      category1: 'Personal Income',
      category2: 'National Tax Service',
      category3: 'Income amount',
      borrowerAppId: borrowerApp1,
      score: 200,
      rewardCycle: REWARD_CYCLE.WEEKLY,
    }, {
      code: 20103,
      category1: 'Personal Income',
      category2: 'National Tax Service',
      category3: 'Health Insurance Premium',
      borrowerAppId: borrowerApp1,
      score: 200,
      rewardCycle: REWARD_CYCLE.WEEKLY,
    }, {
      code: 30100,
      category1: 'Asset',
      category2: 'Real Estate',
      category3: '',
      borrowerAppId: borrowerApp2,
      score: 200,
      rewardCycle: REWARD_CYCLE.ANNUALLY,
    }, {
      code: 30200,
      category1: 'Asset',
      category2: 'Stock',
      category3: '',
      borrowerAppId: borrowerApp2,
      score: 200,
      rewardCycle: REWARD_CYCLE.DAILY,
    }, {
      code: 40100,
      category1: 'Credit Card',
      category2: 'Limit',
      category3: '',
      borrowerAppId: borrowerApp3,
      score: 100,
      rewardCycle: REWARD_CYCLE.WEEKLY,
    }
  ];

  await logTx(
    PersonalDataCategory.methods.setBorrowerAppContractAddress(BorrowerApp.options.address)
      .send({ from: owner }),
    `BorrowerApp: ${BorrowerApp.options.address}`
  );

  for (const category of categories) {
    const { code, category1, category2, category3, borrowerAppId, score, rewardCycle } = category;
    await logTx(
      PersonalDataCategory.methods.add(code, category1, category2, category3, borrowerAppId, score, rewardCycle)
        .send({ from: owner }),
      `category: ${category1}-${category2}-${category3}, borrowerApp: ${borrowerAppId}`
    );

  }
}