import Web3 from 'web3';
import TruffleContract from 'truffle-contract';

// agent
import TokenServerAgent from 'token/agent/TokenServerAgent';

// dc
import TokenDC from 'token/dc/TokenDC';

// util
import getWeb3 from '../util/getWeb3';

// 배포된 컨트랙트 인스턴스를 관리함
class ContractDeployServerAgent {
  public web3: Web3;
  public account: string;
  public tokenContractInstance;

  /*
  배포된 계약의 인스턴스가 세팅되었는지 확인 하기 위한 리스너 등록, 실행
  초기에 1회 실행됨
  */
  private instanceReadyListner: () => void;

  public setInstanceReadyListner(listener: () => void) {
    this.instanceReadyListner = listener;
  }

  private checkContractInstanceReady() {
    if (this.instanceReadyListner === undefined) {
      console.error('contract ready 리스너가 등록되지 않았습니다.');
      return;
    }
    this.instanceReadyListner();
  }

  /*
  App 시작 시 계약 배포, 초기화 코드
  배포된 계약의 인스턴스와 web3, account를 받아 저장함
  */
  public contractInit() {
    this.web3 = getWeb3();
    this.web3.eth.getAccounts((err, accounts) => {
      this.account = accounts[0];
    });
    this.getDeployedContract(); // 등록된 토큰 인스턴스 가져옴
  }

  private async getDeployedContract() {
    const contract = TruffleContract(require('../../../build/contracts/RayonToken.json')); // ABI가져온 후 TruffleContract 객체 생성
    contract.setProvider(this.web3.currentProvider);

    const instance = await contract.deployed(); // Rayon Token의 인스턴스 가져옴
    this.tokenContractInstance = instance;

    this.watchEvent(); // agent에서 블록체인 이벤트를 watch
    this.registTokenListenerToAgent(); // data controller에서 agent에 이벤트 리스너 등록
    this.checkContractInstanceReady(); // 계약 인스턴스가 준비되었는지 확인
  }

  private watchEvent() {
    TokenServerAgent.watchEvent();
  }

  private registTokenListenerToAgent() {
    TokenDC.registTokenListenerToAgent();
  }

  /*
  Getter Funcion For web3, account
  and rayon protocol contract instance
  */
  public getRayonWeb3() {
    return this.web3;
  }

  public getUserAccount() {
    return this.account;
  }

  public getContractInstance() {
    return this.tokenContractInstance;
  }

  /*
  Etc.
  */
  public toAscii(str: string) {
    return this.web3.toAscii(str);
  }
}
export default new ContractDeployServerAgent();
