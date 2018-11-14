module.exports = async function (
  { owner, attester,
    borrower1: user1,
    borrower2: user2,
    borrower3: user3,
    borrower4: user4,
    borrower5: user5,
  }, // addresses
  web3, // web3 instance
  { getContract, logDone, logError }, // utils
) {
  const kycAttester = getContract('kyc/KycAttester');
  const auth = getContract('kyc/Auth');

  const signaturesFromAttester = {
    user1: {
      messageHash: '0x22615f586e4a86b23ead367df957a03709c50c3e9f8d9d951d77eb93984a0744',
      address: user1,
      v: 28,
      r: '0xa6b7c95a10f81894658c8cd401ec39e9fa84db59d89597f5c5de1efcc65c4a64',
      s: '0x179805bf24d9517c2624ff26d0a684e063c3f40711d9c9ba2dece12604bc4d69'
    },
    user2: {
      messageHash: '0xe12a787be240346e45d09eaa9359fd7a7962820c2ded8f05a5a859bcdd303579',
      address: user2,
      v: 28,
      r: '0xc31afdd1a3938d82b9b56b40a7272f5fef0f4ad1f33ab1657edad64a59219e82',
      s: '0x7ceb02eecbc7d24ea8d0b37680a400b9d482f53da5e63b43e1d7f955e4628808'
    },
    user3: {
      messageHash: '0xe89799872416a62940a671d2617fca8be0977d1f52289bc3bc94933421343c70',
      address: user3,
      v: 28,
      r: '0xd213a29179cd5816aae5939bad2b6550ad70be5be33e3d30c8034e167aaa85b9',
      s: '0x483757f28898a4beb109f2b713f68515dcb9cfc6d8ac015fefe67deb036a511e'
    },
    user4: {
      messageHash: '0xd4481b8cf4d5135552fe8c3b7eeb48ccddc0972f6541ef8b6fcc88289c48fa81',
      address: user4,
      v: 28,
      r: '0x579d8f8ce7ac0cd6dfcd7bc7f2f580e5860ef938497b2e72b13b9278d227636d',
      s: '0x0273461da6d09bc1ff55ecec6dcc74e469d9daef4556b35bb06ab7ff6d65a8d3'
    },
    user5: {
      messageHash: '0xf0222e4555f079f2fdbf570707db75ee508caa46321baeff622a993218303d10',
      address: user5,
      v: 28,
      r: '0x6cf2fb83a74d992b1b9e5dd8bb4042b5101f8368e4c52252a2346a5316cc3daf',
      s: '0x433aef939bf88839457c25ae0d0be0e529b9a2c7e8b6a6e6eb2f6eb7f05ad7e4'
    }
  };

  await auth.methods.setKycAttesterContractAddress(kycAttester.options.address).send({ from: owner });

  for (actorName in signaturesFromAttester) {
    const signature = signaturesFromAttester[actorName];
    const description = `user: ${signature.address}, attester: ${attester}`;
    await auth.methods
      .add(signature.messageHash, attester, signature.v, signature.r, signature.s)
      .send({ from: signature.address })
      .then(logDone.bind(logDone, description))
      .catch(logError.bind(logError, description));
  }
}