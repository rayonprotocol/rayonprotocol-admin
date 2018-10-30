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

describe('Get All Logs', () => {
  describe('Success case,', () => {
    describe('when request event logs, response ', () => {
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
      it('should return Array', done => {
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
    describe('when request function logs, response ', () => {
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
      it('should return Array', done => {
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
  });

  describe('Fail case,', () => {
    let body;
    describe('when type parameter missing, response ', () => {
      it('should return status 400', done => {
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
      it('should return collect error message', done => {
        body.result_message.should.be.equal('Log type missing');
        done();
      });
    });
    describe('when request not rayon log type, response ', () => {
      const fakeLogType = 'special';
      it('should return status 400', done => {
        request(app)
          .get(ContractAPI.URLForGetContractLogs)
          .query({
            address: RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address,
            type: fakeLogType,
          })
          .end((err, res) => {
            body = res.body;
            res.status.should.be.equal(400);
            done();
          });
      });
      it('should return collect error message', done => {
        body.result_message.should.be.equal(`${fakeLogType} is not rayon log type`);
        done();
      });
    });
  });
});

describe('Get Rayon Token Function Logs', () => {
  before(() => {
    sandbox = sinon.createSandbox();
    sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve(eventLogs)));
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('Success case, response', () => {
    let resData;
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
    it('should return Array', done => {
      resData.should.be.Array();
      done();
    });
    it('should return Array', done => {
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
    describe('when address parameter missing, response ', () => {
      it('should return status 400', done => {
        request(app)
          .get(ContractAPI.URLForGetContractLogs)
          .query({
            type: ContractAPI.ABI_TYPE_FUNCTION,
          })
          .end((err, res) => {
            body = res.body;
            res.status.should.be.equal(400);
            done();
          });
      });
      it('should return collect error message', done => {
        body.result_message.should.be.equal('Contract address missing');
        done();
      });
    });
    describe('when type parameter missing, response ', () => {
      it('should return status 400', done => {
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
      it('should return collect error message', done => {
        body.result_message.should.be.equal('Log type missing');
        done();
      });
    });
    describe('when request not rayon contract, response ', () => {
      const fakeContractAddr = '0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290';
      it('should return status 400', done => {
        request(app)
          .get(ContractAPI.URLForGetContractLogs)
          .query({
            address: fakeContractAddr,
            type: ContractAPI.ABI_TYPE_FUNCTION,
          })
          .end((err, res) => {
            body = res.body;
            res.status.should.be.equal(400);
            done();
          });
      });
      it('should return collect error message', done => {
        body.result_message.should.be.equal(`${fakeContractAddr} is not rayon contract address`);
        done();
      });
    });
    describe('when request not rayon log type, response ', () => {
      const fakeLogType = 'special';
      it('should return status 400', done => {
        request(app)
          .get(ContractAPI.URLForGetContractLogs)
          .query({
            address: RegistryAgent.getContracts()[ContractIndex.RAYON_TOKEN].address,
            type: fakeLogType,
          })
          .end((err, res) => {
            body = res.body;
            res.status.should.be.equal(400);
            done();
          });
      });
      it('should return collect error message', done => {
        body.result_message.should.be.equal(`${fakeLogType} is not rayon log type`);
        done();
      });
    });
  });
});
