import Web3 from 'web3';
import TruffleContract from 'truffle-contract';

// agent
import TokenServerAgent from 'token/agent/TokenServerAgent';

// model
import { RayonEvent, RayonEventResponce, TransferEvent, MintEvent } from '../../../../shared/event/model/RayonEvent';

// dc
import ContractDeployServerAgent from 'common/agent/ContractDeployServerAgent';

// util
import getWeb3 from 'common/util/getWeb3';

class TokenDC {
  private web3: Web3;
  private userAccount: string;
  private tokenContractInstance;
  private _event = {};
  private _eventListeners = {};

  constructor() {
    this.web3 = getWeb3();
    this.web3.eth.getAccounts((err, accounts) => {
      this.userAccount = accounts[0];
    });
    this.getDeployedContract(); // 등록된 토큰 인스턴스 가져옴
  }

  private async getDeployedContract() {
    const contract = TruffleContract(require('../../../build/contracts/RayonToken.json')); // ABI가져온 후 TruffleContract 객체 생성
    contract.setProvider(this.web3.currentProvider);

    const instance = await contract.deployed(); // Rayon Token의 인스턴스 가져옴
    this.tokenContractInstance = instance;

    TokenServerAgent.setEventListner(RayonEvent.Mint, this.mintEventHandler.bind(this));
    TokenServerAgent.setEventListner(RayonEvent.Transfer, this.transferEventHandler.bind(this));
    TokenServerAgent.start(instance);
    this.checkDataReady(); // 계약 인스턴스가 준비되었는지 확인
  }

  /*
  배포된 계약의 인스턴스가 세팅되었는지 확인 하기 위한 리스너 등록, 실행
  초기에 1회 실행됨
  */
  private dataReadyListner: () => void;

  public setDataReadyListner(listener: () => void) {
    this.dataReadyListner = listener;
  }

  private checkDataReady() {
    if (this.dataReadyListner === undefined) {
      console.error('contract ready 리스너가 등록되지 않았습니다.');
      return;
    }
    this.dataReadyListner();
  }

  /*
  Event listner and server event handler for watch blockchain event
  */
  public addEventListener(eventType: number, listner: (event) => void) {
    this._eventListeners[eventType] === undefined
      ? (this._eventListeners[eventType] = [listner])
      : this._eventListeners[eventType].push(listner);
  }

  public removeEventListener(eventType: number, listner: (event) => void) {
    const targetIndex = this._eventListeners[eventType].indexOf(listner);
    this._eventListeners[eventType].splice(targetIndex, 1);
  }

  private async mintEventHandler(event: RayonEventResponce<MintEvent>) {
    if (this._eventListeners[RayonEvent.Mint] === undefined) return;
    this._event[RayonEvent.Mint] = await TokenServerAgent.fetchMintEvents();
    this._eventListeners[RayonEvent.Mint].forEach(listner => listner(this._event[RayonEvent.Mint]));
  }

  private async transferEventHandler(event: RayonEventResponce<TransferEvent>) {
    if (this._eventListeners[RayonEvent.Transfer] === undefined) return;
    if (event.args.from !== this.userAccount && event.args.to !== this.userAccount) return; // 자신의 트랜잭션일떄만 새로고침

    this._event[RayonEvent.Transfer] = await TokenServerAgent.fetchTransferEvents();
    this._eventListeners[RayonEvent.Transfer].forEach(listner => listner(this._event[RayonEvent.Transfer]));
  }

  /*
  Token basic function
  */
  public mint(toAddress: string, value: number) {
    TokenServerAgent.mint(toAddress, value);
  }

  public transfer(toAddress: string, value: number) {
    TokenServerAgent.transfer(toAddress, value);
  }

  public async fetchTokenTotalBalance() {
    return await TokenServerAgent.fetchTokenTotalBalance();
  }
  public async fetchTokenHolders() {
    return await TokenServerAgent.fetchTokenHolders();
  }
  public async fetchTop10TokenHolders() {
    return await TokenServerAgent.fetchTop10TokenHolders();
  }
  public async fetchChartData() {
    return await TokenServerAgent.fetchChartData();
  }
}

export default new TokenDC();
