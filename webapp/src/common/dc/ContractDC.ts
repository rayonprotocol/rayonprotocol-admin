import Web3 from 'web3';
import TruffleContract from 'truffle-contract';

// dc
import TokenDC from 'token/dc/TokenDC';

// util
import getWeb3 from '../util/getWeb3';

class ContractDC {
  public web3: Web3;
  public account: string;
  private tokenContractInstance;

  private instanceReadyListner: () => void;

  // contract deploy, migrate, initializing
  // App 시작 시 계약 배포, 초기화 진행
  public contractInit() {
    this.web3 = getWeb3();
    this.web3.eth.getAccounts((err, accounts) => {
      this.account = accounts[0];
    });
    this.getDeployedContract();
  }

  // 등록된 토큰 인스턴스 가져옴
  private async getDeployedContract() {
    const contract = TruffleContract(require('../../../build/contracts/RayonToken.json'));
    contract.setProvider(this.web3.currentProvider);
    const instance = await contract.deployed();
    this.tokenContractInstance = instance;
    this.attachEvent();
    this.checkContractInstanceReady();
  }

  // 계약 인스턴스가 준비되었는지 확인
  private checkContractInstanceReady() {
    if (this.instanceReadyListner === undefined) return console.error('contract ready 리스너가 등록되지 않았습니다.');
    this.instanceReadyListner();
  }

  // 계약 인스턴스에 이벤트 attach
  attachEvent() {
    TokenDC.attachTokenMintEvent(this.tokenContractInstance);
    TokenDC.attachTokenTransferEvent(this.tokenContractInstance);
  }

  // common getter function
  public getTokenContractInstance() {
    return this.tokenContractInstance;
  }

  public getAccount() {
    return this.account;
  }

  public getWeb3() {
    return this.web3;
  }

  // common setter function
  // 시작 시 app에서 계약이 모두 배포되었는지 확인하기 위한 리스너
  public setInstanceReadyListner(listener: () => void) {
    this.instanceReadyListner = listener;
  }

  // util
  public toAscii(str: string) {
    return this.web3.toAscii(str);
  }
}

export default new ContractDC();
