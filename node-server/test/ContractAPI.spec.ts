import 'mocha';
import 'should';
import * as sinon from 'sinon';
import * as axios from 'axios';
import * as httpMocks from 'node-mocks-http';
import * as myEventEmitter from 'events';

// model
import * as ContractAPI from '../../shared/contract/model/Contract';

// dc
import ContractDC from '../src/contract/dc/ContractDC';

let req, res;

describe('Contract API', () => {
  it('should get contract infomation when request with address', async done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: ContractAPI.URLForGetContractOverview,
      query: {
        address: '0x87734414f6fe26c3fff5b3fa69d379be4c0a2056',
      },
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', async () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      resData.should.have.properties(['address', 'name', 'owner', 'deployedBlockNumber']);
      resData.address.should.be.equal('0x87734414f6fe26c3fff5b3fa69d379be4c0a2056');
      resData.name.should.be.equal('RayonToken');
      resData.owner.should.be.equal('0x63d49dae293Ff2F077F5cDA66bE0dF251a0d3290');
      resData.deployedBlockNumber.should.be.equal(0);
      done();
    });

    await ContractDC.respondContractOverview(req, res);
  });
  it('should send null when address is missing', async done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: ContractAPI.URLForGetContractOverview,
      query: {
        address: '0x5C79E76230520Fb939C1777C010a1a6419d2Ed4f',
      },
    });
    res = httpMocks.createResponse({
      eventEmitter: myEventEmitter,
    });
    res.on('end', async () => {
      const resData = res._getData().data;
      res.statusCode.should.be.equal(200);
      (resData === null).should.be.equal(true);
      done();
    });

    await ContractDC.respondContractOverview(req, res);
  });
});
