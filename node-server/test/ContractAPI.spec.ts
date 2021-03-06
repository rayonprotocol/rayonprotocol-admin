// import 'mocha';
// import 'should';
// import * as request from 'supertest';

// // app
// import app from '../src/main/controller/RayonNodeServerApp';

// // agent
// import DbAgent from '../src/common/agent/DbAgent';
// import ContractBlockchainAgent from '../src/contract/agent/ContractBlockchainAgent';

// // model
// import * as ContractAPI from '../../shared/contract/model/Contract';

// // dc
// import ContractDC from '../src/contract/dc/ContractDC';
// import Web3Controller from '../src/common/controller/Web3Controller';

// let sandbox;

// describe('Get All contract', () => {
//   describe('Success case, response', async () => {
//     let resData;
//     const rayonTokenContract = await ContractBlockchainAgent.fetchAllContractInfo();
//     it('should return status 200', done => {
//       request(app)
//         .get(ContractAPI.URLForGetAllContracts)
//         .end((err, res) => {
//           resData = res.body.data;
//           res.status.should.be.equal(200);
//           done();
//         });
//     });
//     it('should return Array', done => {
//       resData.should.be.Array();
//       done();
//     });
//     it('should have contract properties', done => {
//       resData[0].should.have.properties(Object.keys(rayonTokenContract));
//       done();
//     });
//   });
// });

// describe('Get rayon token logs', function() {
//   const rayonTokenContractAddr = RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address;
//   let rayonTokenInstance = Web3Controller.getContractInstance(rayonTokenContractAddr);

//   this.timeout(8000); // for increse each test case timeout limit

//   describe('Success case,', () => {
//     describe('when call mint transaction', () => {
//       const targetAddr = '0x63d49dae293ff2f077f5cda66be0df251a0d3290';
//       const ownerAddr = '0x63d49dae293ff2f077f5cda66be0df251a0d3290';
//       let newBlockTxHash;
//       let newTransaction;
//       before(done => {
//         rayonTokenInstance.methods.mint(targetAddr, '10000000000000000000').send({ from: ownerAddr }, (err, txHash) => {
//           newBlockTxHash = txHash;
//           setTimeout(done, 4000);
//         });
//       });
//       before(done => {
//         Web3Controller.getWeb3().eth.getTransaction(newBlockTxHash, (err, transaction) => {
//           newTransaction = transaction;
//           done();
//         });
//       });
//       describe('request rayon token event logs', () => {
//         let resData;
//         let targetEventLog;
//         it('should return status 200', done => {
//           request(app)
//             .get(ContractAPI.URLForGetContractLogs)
//             .query({
//               address: rayonTokenContractAddr,
//               type: ContractAPI.ABI_TYPE_EVENT,
//             })
//             .end((err, res) => {
//               resData = res.body.data;
//               res.status.should.be.equal(200);
//               done();
//             });
//         });
//         it('should have these properties', done => {
//           targetEventLog = resData.pop();
//           targetEventLog.should.have.properties([
//             'blockNumber',
//             'txHash',
//             'calledTime',
//             'status',
//             'contractAddress',
//             'functionName',
//             'inputData',
//             'urlEtherscan',
//             'environment',
//             'eventName',
//           ]);
//           done();
//         });
//         it('should be equal blockNumber', done => {
//           targetEventLog.blockNumber.should.be.equal(newTransaction.blockNumber);
//           done();
//         });
//         it('should be equal txHash', done => {
//           targetEventLog.txHash.should.be.equal(newTransaction.hash);
//           done();
//         });
//         it('should be equal contract Address', done => {
//           targetEventLog.contractAddress.should.be.equal(rayonTokenContractAddr);
//           done();
//         });
//       });
//       describe('request rayon token function logs', () => {
//         let resData;
//         let targetFunctionLog;
//         it('should return status 200', done => {
//           request(app)
//             .get(ContractAPI.URLForGetContractLogs)
//             .query({
//               address: rayonTokenContractAddr,
//               type: ContractAPI.ABI_TYPE_FUNCTION,
//             })
//             .end((err, res) => {
//               resData = res.body.data;
//               res.status.should.be.equal(200);
//               done();
//             });
//         });
//         it('should have these properties', done => {
//           targetFunctionLog = resData.pop();
//           targetFunctionLog.should.have.properties([
//             'blockNumber',
//             'txHash',
//             'status',
//             'contractAddress',
//             'functionName',
//             'inputData',
//             'calledTime',
//             'urlEtherscan',
//             'environment',
//           ]);
//           done();
//         });
//         it('should be equal blockNumber', done => {
//           targetFunctionLog.blockNumber.should.be.equal(newTransaction.blockNumber);
//           done();
//         });
//         it('should be equal txHash', done => {
//           targetFunctionLog.txHash.should.be.equal(newTransaction.hash);
//           done();
//         });
//         it('should be equal contract Address', done => {
//           targetFunctionLog.contractAddress.should.be.equal(rayonTokenContractAddr);
//           done();
//         });
//       });
//     });
//     describe('when call transfer transaction', () => {
//       const targetAddr = '0x5C79E76230520Fb939C1777C010a1a6419d2Ed4f';
//       const ownerAddr = '0x63d49dae293ff2f077f5cda66be0df251a0d3290';
//       let newBlockTxHash;
//       let newTransaction;
//       before(done => {
//         rayonTokenInstance.methods
//           .transfer(targetAddr, '5000000000000000000')
//           .send({ from: ownerAddr }, (err, txHash) => {
//             newBlockTxHash = txHash;
//             setTimeout(done, 4000);
//           });
//       });
//       before(done => {
//         Web3Controller.getWeb3().eth.getTransaction(newBlockTxHash, (err, transaction) => {
//           newTransaction = transaction;
//           done();
//         });
//       });
//       describe('request rayon token event logs', () => {
//         let resData;
//         let targetEventLog;
//         it('should return status 200', done => {
//           request(app)
//             .get(ContractAPI.URLForGetContractLogs)
//             .query({
//               address: rayonTokenContractAddr,
//               type: ContractAPI.ABI_TYPE_EVENT,
//             })
//             .end((err, res) => {
//               resData = res.body.data;
//               res.status.should.be.equal(200);
//               done();
//             });
//         });
//         it('should have these properties', done => {
//           targetEventLog = resData.pop();
//           targetEventLog.should.have.properties([
//             'blockNumber',
//             'txHash',
//             'calledTime',
//             'status',
//             'contractAddress',
//             'functionName',
//             'inputData',
//             'urlEtherscan',
//             'environment',
//             'eventName',
//           ]);
//           done();
//         });
//         it('should be equal blockNumber', done => {
//           targetEventLog.blockNumber.should.be.equal(newTransaction.blockNumber);
//           done();
//         });
//         it('should be equal txHash', done => {
//           targetEventLog.txHash.should.be.equal(newTransaction.hash);
//           done();
//         });
//         it('should be equal contract Address', done => {
//           targetEventLog.contractAddress.should.be.equal(rayonTokenContractAddr);
//           done();
//         });
//       });
//       describe('request rayon token function logs', () => {
//         let resData;
//         let targetFunctionLog;
//         it('should return status 200', done => {
//           request(app)
//             .get(ContractAPI.URLForGetContractLogs)
//             .query({
//               address: rayonTokenContractAddr,
//               type: ContractAPI.ABI_TYPE_FUNCTION,
//             })
//             .end((err, res) => {
//               resData = res.body.data;
//               res.status.should.be.equal(200);
//               done();
//             });
//         });
//         it('should have these properties', done => {
//           targetFunctionLog = resData.pop();
//           targetFunctionLog.should.have.properties([
//             'blockNumber',
//             'txHash',
//             'status',
//             'contractAddress',
//             'functionName',
//             'inputData',
//             'calledTime',
//             'urlEtherscan',
//             'environment',
//           ]);
//           done();
//         });
//         it('should be equal blockNumber', done => {
//           targetFunctionLog.blockNumber.should.be.equal(newTransaction.blockNumber);
//           done();
//         });
//         it('should be equal txHash', done => {
//           targetFunctionLog.txHash.should.be.equal(newTransaction.hash);
//           done();
//         });
//         it('should be equal contract Address', done => {
//           targetFunctionLog.contractAddress.should.be.equal(rayonTokenContractAddr);
//           done();
//         });
//       });
//     });
//   });
//   describe('Fail case,', () => {
//     let body;
//     it('should return status 400 and error message when address parameter missing', done => {
//       request(app)
//         .get(ContractAPI.URLForGetContractLogs)
//         .query({
//           type: ContractAPI.ABI_TYPE_FUNCTION,
//         })
//         .end((err, res) => {
//           body = res.body;
//           res.status.should.be.equal(400);
//           body.result_message.should.be.equal('Contract address missing');
//           done();
//         });
//     });
//     it('should return status 400 and error message when type parameter missing, response ', done => {
//       request(app)
//         .get(ContractAPI.URLForGetContractLogs)
//         .query({
//           address: RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address,
//         })
//         .end((err, res) => {
//           body = res.body;
//           res.status.should.be.equal(400);
//           body.result_message.should.be.equal('Log type missing');
//           done();
//         });
//     });

//     it('should return status 400 and error message when request not rayon contract, response ', done => {
//       const fakeContractAddr = '0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290';
//       request(app)
//         .get(ContractAPI.URLForGetContractLogs)
//         .query({
//           address: fakeContractAddr,
//           type: ContractAPI.ABI_TYPE_FUNCTION,
//         })
//         .end((err, res) => {
//           body = res.body;
//           res.status.should.be.equal(400);
//           body.result_message.should.be.equal(`${fakeContractAddr} is not rayon contract address`);
//           done();
//         });
//     });
//     it('should return status 400 and error message  when request not rayon log type', done => {
//       const fakeLogType = 'special';
//       request(app)
//         .get(ContractAPI.URLForGetContractLogs)
//         .query({
//           address: RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address,
//           type: fakeLogType,
//         })
//         .end((err, res) => {
//           body = res.body;
//           res.status.should.be.equal(400);
//           body.result_message.should.be.equal(`${fakeLogType} is not rayon log type`);
//           done();
//         });
//     });
//   });
// });
