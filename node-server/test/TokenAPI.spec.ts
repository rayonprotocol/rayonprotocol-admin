import 'mocha';
import 'should';
import * as request from 'supertest';
import * as sinon from 'sinon';
import BigNumber from 'bignumber.js';

// app
import app from '../src/main/controller/RayonNodeServerApp';

// agent
import DbAgent from '../src/common/agent/DbAgent';
import TokenBlockchainAgent from '../src/token/agent/TokenBlockchainAgent';

// dc
import TokenDC from '../src/token/dc/TokenDC';

// model
import * as TokenAPI from '../../shared/token/model/Token';

// mock
import { holders, tokenHistory } from './mocks/token';

let sandbox;

describe('Get token cap', () => {
  describe('Success case, response', () => {
    let resData;
    it('should return status 200', done => {
      request(app)
        .get(TokenAPI.URLForGetTokenCap)
        .end((err, res) => {
          resData = res.body.data;
          res.status.should.be.equal(200);
          done();
        });
    });
    it('should return token cap', done => {
      resData.should.be.equal(5000);
      done();
    });
  });
});

describe('Get token total supply', () => {
  before(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('Success case, response', () => {
    let resData;
    it('should return status 200', done => {
      sandbox.replace(
        TokenBlockchainAgent,
        'getTotalSupply',
        () => new Promise((resolve, reject) => resolve(new BigNumber(100)))
      );
      request(app)
        .get(TokenAPI.URLForGetTokenTotalSupply)
        .end((err, res) => {
          resData = res.body.data;
          res.status.should.be.equal(200);
          done();
        });
    });
    it('should return total supply', done => {
      resData.should.be.equal(100);
      done();
    });
  });
});

describe('Get token holders', () => {
  before(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('Success case, response', () => {
    let resData;
    it('should return status 200', done => {
      sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve(holders)));
      request(app)
        .get(TokenAPI.URLForGetTokenHolders)
        .end((err, res) => {
          resData = res.body.data;
          res.status.should.be.equal(200);
          done();
        });
    });
    it('should have these properties', done => {
      resData[0].should.have.properties(['address', 'balance']);
      done();
    });
  });
});

describe('Get token holders', () => {
  before(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('Success case, response', () => {
    let resData;
    it('should return status 200', done => {
      sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve(tokenHistory)));
      request(app)
        .get(TokenAPI.URLForGetTokenHistory)
        .query({
          userAddr: '0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290',
        })
        .end((err, res) => {
          resData = res.body.data;
          res.status.should.be.equal(200);
          done();
        });
    });
    it('should be array', done => {
      resData.should.be.Array();
      done();
    });
    it('should have these properties', done => {
      resData[0].should.have.properties(['from', 'to', 'amount', 'calledTime']);
      done();
    });
    it('should be collect from address', done => {
      resData[0].from.should.be.equal('0x0000000000000000000000000000000000000000');
      done();
    });
    it('should be collect to address', done => {
      resData[0].to.should.be.equal('0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290');
      done();
    });
    it('should be collect amount', done => {
      resData[0].amount.should.be.equal(10);
      done();
    });
    it('should be collect called time', done => {
      resData[0].calledTime.should.be.equal(1540364588);
      done();
    });
  });
  describe('Fail case,', () => {
    let body;
    it('should return status 400 and error message when userAddress missing', done => {
      request(app)
        .get(TokenAPI.URLForGetTokenHistory)
        .end((err, res) => {
          body = res.body;
          res.status.should.be.equal(400);
          body.result_message.should.be.equal('User address missing');
          done();
        });
    });
  });
});
