// import 'mocha';
// import 'should';
// import * as sinon from 'sinon';

// // agent
// import DbAgent from '../src/common/agent/DbAgent';
// import RayonLogDbAgent from '../src/log/agent/RayonLogDbAgent';
// import RegistryAgent from '../src/registry/agent/RegistryAgent';

// // controller
// import Web3Controller from '../src/common/controller/Web3Controller';

// const web3 = Web3Controller.getWeb3();
// let sandbox;

// describe('RayonLogDbAgent', () => {
//   before(() => {
//     sandbox = sinon.createSandbox();
//   });
//   afterEach(() => {
//     sandbox.restore();
//   });
//   it('should return collect number when call getNextBlockToRead', async () => {
//     sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve([{ readLastBlock: 0 }])));
//     let nextBlockNumber = await RayonLogDbAgent.getNextBlockNumberToRead();
//     nextBlockNumber.should.be.equal(1);

//     sandbox.restore();

//     sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve([{ readLastBlock: 2 }])));
//     nextBlockNumber = await RayonLogDbAgent.getNextBlockNumberToRead();
//     nextBlockNumber.should.be.equal(3);

//     sandbox.restore();

//     sandbox.replace(
//       DbAgent,
//       'executeAsync',
//       () => new Promise((resolve, reject) => resolve([{ readLastBlock: null }]))
//     );
//     nextBlockNumber = await RayonLogDbAgent.getNextBlockNumberToRead();
//     nextBlockNumber.should.be.equal(RegistryAgent.getFirstContractAddress());
//   });
// });
