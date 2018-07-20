const RayonTokenCrowdsale = artifacts.require('./RayonTokenCrowdsale.sol');
const RayonToken = artifacts.require('./RayonToken.sol');

module.exports = function(deployer, network, accounts) {
  return deployer
    .then(() => {
      return deployer.deploy(RayonToken);
    })
    .then(() => {
      const startTime = Math.round(new Date(Date.now() + 200000).getTime() / 1000);
      const endTime = Math.round((new Date().getTime() + 86400000 * 20) / 1000); // Today + 20 days
      console.log('startTime', startTime);
      const rate = 5;
      // const wallet = accounts[0];
      const wallet = '0x6EB16b36dAA3D123b553fcB25d723105a77aD7c6';
      return deployer.deploy(RayonTokenCrowdsale, startTime, endTime, rate, wallet, RayonToken.address);
    });
};