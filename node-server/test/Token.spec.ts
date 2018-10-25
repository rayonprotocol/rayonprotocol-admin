// import 'mocha';
// import 'should';
// import * as sinon from 'sinon';
// import Web3 from 'web3';

// // agent
// import ContractDbAgent from '../src/contract/agent/ContractDbAgent';
// import RayonLogCollectAgent from '../src/log/agent/RayonLogCollectAgent';
// import RayonLogDbAgent from '../src/log/agent/RayonLogDbAgent';

// // controller
// import Web3Controller from '../src/common/controller/Web3Controller';

// // model
// import Contract from '../../shared/contract/model/Contract';
// import ContractConfigure from '../../shared/common/model/ContractConfigure';
// import { TxBlock } from '../src/common/model/Web3Type';

// // mock
// import { txBlocks } from './mocks/TxBlocks';

// // util
// import ContractUtil from '../src/common/util/ContractUtil';

// const web3 = Web3Controller.getWeb3();
// let sandbox;

// describe('Token', () => {
//   before(() => {
//     sandbox = sinon.createSandbox();
//     sandbox.replace(
//       web3.eth,
//       'getBlock',
//       arg =>
//         arg === 'latest'
//           ? new Promise((resolve, reject) => resolve(txBlocks[3]))
//           : new Promise((resolve, reject) => resolve(txBlocks[arg]))
//     );
//     sandbox.replace(RayonLogDbAgent, 'getNextBlockToRead', () => new Promise((resolve, reject) => resolve(0)));
//     sandbox.replace(RayonLogDbAgent, 'storeTxLogs', () => new Promise((resolve, reject) => resolve(true)));
//   });
//   it('should return event when send mint transaction', async () => {
//     RayonLogCollectAgent.collectionStart();

//     const test = 'test';
//     test.should.be.equal('test');
//   });
// });
