import 'mocha';
import 'should';
import * as request from 'supertest';
import * as sinon from 'sinon';

// app
import app from '../src/main/controller/RayonNodeServerApp';

// agent
import DbAgent from '../src/common/agent/DbAgent';
import RegistryAgent from '../src/registry/agent/RegistryAgent';

// model
import { ContractIndex } from '../src/registry/model/Registry';
import * as ContractAPI from '../../shared/contract/model/Contract';

// dc
import ContractDC from '../src/contract/dc/ContractDC';
import Web3Controller from '../src/common/controller/Web3Controller';

// mocks
import { eventLogs, functionLogs, rayonTokenEventLogs, rayonTokenFunctionLogs } from './mocks/logs';

let sandbox;

describe('Get All contract', () => {
  describe('Success case, response', () => {
    let resData;
    const rayonTokenContract = RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN];
    it('should return status 200', done => {
      request(app)
        .get(ContractAPI.URLForGetAllContracts)
        .end((err, res) => {
          resData = res.body.data;
          res.status.should.be.equal(200);
          done();
        });
    });
    it('should return Array', done => {
      resData.should.be.Array();
      done();
    });
    it('should have contract properties', done => {
      resData[ContractIndex.RAYON_TOKEN].should.have.properties(Object.keys(rayonTokenContract));
      done();
    });
    it('should be equal contract address', done => {
      resData[ContractIndex.RAYON_TOKEN].address.should.be.equal(rayonTokenContract.address);
      done();
    });
    it('should be equal contract name', done => {
      resData[ContractIndex.RAYON_TOKEN].name.should.be.equal(rayonTokenContract.name);
      done();
    });
    it('should be equal contract owner address', done => {
      resData[ContractIndex.RAYON_TOKEN].owner.should.be.equal(rayonTokenContract.owner);
      done();
    });
    it('should be equal contract block number', done => {
      resData[ContractIndex.RAYON_TOKEN].deployedBlockNumber.should.be.equal(0);
      done();
    });
  });
});

describe('Get rayon token logs', function() {
  let rayonTokenInstance;
  let newBlockTxHash;
  let newTransaction;
  const targetAddr = '0xb28d0b93eb6aF266C52F40d840084a59B7BCd8B5';
  const ownerAddr = '0x63d49dae293ff2f077f5cda66be0df251a0d3290';
  this.timeout(8000); // for increse each test case timeout limit
  before(done => {
    const rayonTokenContractAddr = RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address;
    rayonTokenInstance = Web3Controller.getContractInstance(rayonTokenContractAddr);
    rayonTokenInstance.methods.mint(targetAddr, 500).send({ from: ownerAddr }, (err, txHash) => {
      newBlockTxHash = txHash;
      setTimeout(done, 4000);
    });
  });
  before(done => {
    Web3Controller.getWeb3().eth.getTransaction(newBlockTxHash, (err, transaction) => {
      newTransaction = transaction;
      done();
    });
  });
  describe('Success case, response', () => {
    describe('request rayon token event logs', () => {
      let resData;
      let targetEventLog;
      it('should return status 200', done => {
        request(app)
          .get(ContractAPI.URLForGetContractLogs)
          .query({
            address: RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address,
            type: ContractAPI.ABI_TYPE_EVENT,
          })
          .end((err, res) => {
            resData = res.body.data;
            res.status.should.be.equal(200);
            done();
          });
      });
      it('should have these properties', done => {
        targetEventLog = resData.pop();
        targetEventLog.should.have.properties([
          'blockNumber',
          'txHash',
          'calledTime',
          'status',
          'contractAddress',
          'functionName',
          'inputData',
          'urlEtherscan',
          'environment',
          'eventName',
        ]);
        done();
      });
      it('should be equal blockNumber', done => {
        targetEventLog.blockNumber.should.be.equal(newTransaction.blockNumber);
        done();
      });
      it('should be equal txHash', done => {
        targetEventLog.txHash.should.be.equal(newTransaction.hash);
        done();
      });
      it('should be equal contract Address', done => {
        targetEventLog.contractAddress.should.be.equal(RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address);
        done();
      });
    });
    describe('request rayon token function logs', () => {
      let resData;
      let targetFunctionLog;
      it('should return status 200', done => {
        request(app)
          .get(ContractAPI.URLForGetContractLogs)
          .query({
            address: RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address,
            type: ContractAPI.ABI_TYPE_FUNCTION,
          })
          .end((err, res) => {
            resData = res.body.data;
            res.status.should.be.equal(200);
            done();
          });
      });
      it('should have these properties', done => {
        targetFunctionLog = resData.pop();
        targetFunctionLog.should.have.properties([
          'blockNumber',
          'txHash',
          'status',
          'contractAddress',
          'functionName',
          'inputData',
          'calledTime',
          'urlEtherscan',
          'environment',
        ]);
        done();
      });
      it('should be equal blockNumber', done => {
        targetFunctionLog.blockNumber.should.be.equal(newTransaction.blockNumber);
        done();
      });
      it('should be equal txHash', done => {
        targetFunctionLog.txHash.should.be.equal(newTransaction.hash);
        done();
      });
      it('should be equal contract Address', done => {
        targetFunctionLog.contractAddress.should.be.equal(
          RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address
        );
        done();
      });
    });
  });
  describe('Fail case,', () => {
    let body;
    it('should return status 400 and error message when address parameter missing', done => {
      request(app)
        .get(ContractAPI.URLForGetContractLogs)
        .query({
          type: ContractAPI.ABI_TYPE_FUNCTION,
        })
        .end((err, res) => {
          body = res.body;
          res.status.should.be.equal(400);
          body.result_message.should.be.equal('Contract address missing');
          done();
        });
    });
    it('should return status 400 and error message when type parameter missing, response ', done => {
      request(app)
        .get(ContractAPI.URLForGetContractLogs)
        .query({
          address: RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address,
        })
        .end((err, res) => {
          body = res.body;
          res.status.should.be.equal(400);
          body.result_message.should.be.equal('Log type missing');
          done();
        });
    });

    it('should return status 400 and error message when request not rayon contract, response ', done => {
      const fakeContractAddr = '0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290';
      request(app)
        .get(ContractAPI.URLForGetContractLogs)
        .query({
          address: fakeContractAddr,
          type: ContractAPI.ABI_TYPE_FUNCTION,
        })
        .end((err, res) => {
          body = res.body;
          res.status.should.be.equal(400);
          body.result_message.should.be.equal(`${fakeContractAddr} is not rayon contract address`);
          done();
        });
    });
    it('should return status 400 and error message  when request not rayon log type', done => {
      const fakeLogType = 'special';
      request(app)
        .get(ContractAPI.URLForGetContractLogs)
        .query({
          address: RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address,
          type: fakeLogType,
        })
        .end((err, res) => {
          body = res.body;
          res.status.should.be.equal(400);
          body.result_message.should.be.equal(`${fakeLogType} is not rayon log type`);
          done();
        });
    });
  });
});

describe('Get All logs', () => {
  describe('Success case', () => {
    describe('request event logs', () => {
      let resData;
      before(() => {
        sandbox = sinon.createSandbox();
      });
      afterEach(() => {
        sandbox.restore();
      });
      it('should return status 200', done => {
        sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve(eventLogs)));
        request(app)
          .get(ContractAPI.URLForGetAllLogs)
          .query({ type: ContractAPI.ABI_TYPE_EVENT })
          .end((err, res) => {
            resData = res.body.data;
            res.status.should.be.equal(200);
            done();
          });
      });
      it('should return Array', done => {
        resData.should.be.Array();
        done();
      });
      it('should have these properties', done => {
        resData[0].should.have.properties([
          'blockNumber',
          'txHash',
          'status',
          'contractAddress',
          'eventName',
          'functionName',
          'inputData',
          'calledTime',
          'urlEtherscan',
          'environment',
        ]);
        done();
      });
    });

    describe('request function logs', () => {
      let resData;
      before(() => {
        sandbox = sinon.createSandbox();
      });
      afterEach(() => {
        sandbox.restore();
      });
      it('should return status 200', done => {
        sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve(eventLogs)));
        request(app)
          .get(ContractAPI.URLForGetAllLogs)
          .query({ type: ContractAPI.ABI_TYPE_FUNCTION })
          .end((err, res) => {
            resData = res.body.data;
            res.status.should.be.equal(200);
            done();
          });
      });
      it('should return Array', done => {
        resData.should.be.Array();
        done();
      });
      it('should have these properties', done => {
        resData[0].should.have.properties([
          'blockNumber',
          'txHash',
          'status',
          'contractAddress',
          'functionName',
          'inputData',
          'calledTime',
          'urlEtherscan',
          'environment',
        ]);
        done();
      });
    });

    describe('Fail case,', () => {
      let body;
      const fakeLogType = 'special';

      it('should return status 400 when type missing', done => {
        request(app)
          .get(ContractAPI.URLForGetContractLogs)
          .query({
            address: RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address,
          })
          .end((err, res) => {
            body = res.body;
            res.status.should.be.equal(400);
            body.result_message.should.be.equal('Log type missing');
            done();
          });
      });
      it('should return status 400 and error message when log type missing', done => {
        request(app)
          .get(ContractAPI.URLForGetContractLogs)
          .query({
            address: RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address,
          })
          .end((err, res) => {
            body = res.body;
            res.status.should.be.equal(400);
            done();
          });
      });
      it('should return status 400 and error message when request not rayon log type ', done => {
        request(app)
          .get(ContractAPI.URLForGetContractLogs)
          .query({
            address: RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address,
            type: fakeLogType,
          })
          .end((err, res) => {
            body = res.body;
            res.status.should.be.equal(400);
            body.result_message.should.be.equal(`${fakeLogType} is not rayon log type`);
            done();
          });
      });
    });
  });
});
