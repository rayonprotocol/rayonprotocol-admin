import 'mocha';
import 'should';
import * as sinon from 'sinon';
import * as httpMocks from 'node-mocks-http';
import * as myEventEmitter from 'events';
import BigNumber from 'bignumber.js';

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
let req, res;

describe('Token API', () => {
  before(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('should return token cap', done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: TokenAPI.URLForGetTokenCap,
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      resData.should.be.equal(5000);
      done();
    });

    TokenDC.respondTokenCap(req, res);
  });
  it('should return total supply', done => {
    sandbox.replace(
      TokenBlockchainAgent,
      'getTotalSupply',
      () => new Promise((resolve, reject) => resolve(new BigNumber(100)))
    );
    req = httpMocks.createRequest({
      method: 'GET',
      url: TokenAPI.URLForGetTokenTotalSupply,
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      resData.should.be.equal(100);
      done();
    });

    TokenDC.respondTotalSupply(req, res);
  });
  it('should return token holders', done => {
    sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve(holders)));
    req = httpMocks.createRequest({
      method: 'GET',
      url: TokenAPI.URLForGetTokenHolders,
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      resData[0].should.have.properties(['address', 'balance']);
      resData.should.have.length(3);
      done();
    });

    TokenDC.respondTokenHolders(req, res);
  });

  it('should return token holder histories', done => {
    sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve(tokenHistory)));
    req = httpMocks.createRequest({
      method: 'GET',
      url: TokenAPI.URLForGetTokenHistory,
      query: {
        userAddr: '0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290',
      },
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      resData.should.be.Array();
      resData[0].should.have.properties(['from', 'to', 'amount', 'calledTime']);
      resData[0].from.should.be.equal('0x0000000000000000000000000000000000000000');
      resData[0].to.should.be.equal('0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290');
      resData[0].amount.should.be.equal(10);
      resData[0].calledTime.should.be.equal(1540364588);
      done();
    });

    TokenDC.respondTokenHistory(req, res);
  });

  it('should send null when request wrong address', done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: TokenAPI.URLForGetTokenHistory,
      query: {
        userAddr: '0x9d9f0',
      },
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      resData.should.be.a.Array();
      resData.should.have.length(0);
      done();
    });

    TokenDC.respondTokenHistory(req, res);
  });
});
