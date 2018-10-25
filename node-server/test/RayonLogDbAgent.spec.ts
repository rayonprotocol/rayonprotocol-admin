import 'mocha';
import 'should';
import * as dotenv from 'dotenv';
import * as sinon from 'sinon';

// agent
import DbAgent from '../src/common/agent/DbAgent';
import RayonLogDbAgent from '../src/log/agent/RayonLogDbAgent';

// controller
import Web3Controller from '../src/common/controller/Web3Controller';

dotenv.config();

const web3 = Web3Controller.getWeb3();
let sandbox;

describe('RayonLogDbAgent', () => {
  before(() => {
    sandbox = sinon.createSandbox();
  });
  after(() => {
    sandbox.restore();
  });
  it('should return number when call getNextBlockToRead', async () => {
    sandbox.replace(DbAgent, 'executeAsync', () => new Promise((resolve, reject) => resolve([0])));
    const nextBlockToRead = await RayonLogDbAgent.getNextBlockToRead();
    nextBlockToRead.should.be.equal(0);
    // const test = 'test';
    // test.should.be.equal('test');
  });
});
