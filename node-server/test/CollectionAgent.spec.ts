import 'mocha';
import 'should';
import * as request from 'supertest';

// app
import app from '../src/main/controller/RayonNodeServerApp';

// agent
import RegistryAgent from '../src/registry/agent/RegistryAgent';

// controller
import Web3Controller from '../src/common/controller/Web3Controller';

// model
import { ContractIndex } from '../src/registry/model/Registry';
import * as ContractAPI from '../../shared/contract/model/Contract';

// util
import DateUtil from '../../shared/common/util/DateUtil';

describe('SEND Mint Transaction to Rayon Token contract', function() {
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
    let resData;
    let targetEventLog;
    it('should return status 200', done => {
      request(app)
        .get(ContractAPI.URLForGetAllLogs)
        .query({ type: ContractAPI.ABI_TYPE_EVENT })
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
});
