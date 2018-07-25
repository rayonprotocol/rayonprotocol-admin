// model
import RayonEvent, {
  MintEvent,
  MintArgs,
  TransferEvent,
  TransferArgs,
  BlockTime,
} from '../../../../shared/event/model/RayonEvent';

// dc
import ContractDC from 'common/dc/ContractDC';

type Listner = (event) => void;

interface EventListener {
  [componentName: string]: Listner;
}

class TokenDC {
  mintEventListeners: EventListener = {};
  transferEventListeners: EventListener = {};

  mintEvents: MintEvent[] = [];
  transferEvents: TransferEvent[] = [];

  async getTotalBalance() {
    const instance = ContractDC.getTokenContractInstance();
    const totalSupply = (await instance.totalSupply()).toNumber();

    return totalSupply;
  }

  /*
  For Rayon Token Transfer,
  Include transfer and watch, stop, set Event
  */
  mint(toAddress: string, value: number) {
    const instance = ContractDC.getTokenContractInstance();
    instance.mint(toAddress, value, { from: ContractDC.getAccount() });
  }

  attachTokenMintEvent(instance) {
    const mintEvent = instance.Mint({}, { fromBlock: 0, toBlock: 'latest' });
    mintEvent.watch(this.mintEventHandler.bind(this));
  }

  mintEventHandler(error, event: RayonEvent<MintArgs>) {
    if (error) console.error(error);
    const newEvent: MintEvent = {
      to: event.args.to,
      amount: event.args.amount.toNumber(),
    };

    this.mintEvents.push(newEvent);
    console.log('mintEvents', newEvent);
    this.notifyMintEvent(this.mintEvents);
  }

  notifyMintEvent(events: MintEvent[]) {
    const keys = Object.keys(this.mintEventListeners);
    keys.forEach(item => this.mintEventListeners[item](events));
  }

  subscribeMintEvent(componentName: string, listener: (events: MintEvent[]) => void) {
    this.mintEventListeners[componentName] === undefined
      ? (this.mintEventListeners[componentName] = listener)
      : console.error('Listener ' + componentName + ' is already Existing, check your code');
  }

  unsubscribeMintEvent(componentName: string) {
    this.mintEventListeners[componentName] === undefined
      ? console.error('Listener ' + componentName + ' is undefined, check your code')
      : delete this.mintEventListeners[componentName];
  }

  /*
  For about Rayon Token Mint,
  Include transfer and watch, stop, set Event
  */

  transfer(toAddress: string, value: number) {
    const instance = ContractDC.getTokenContractInstance();
    instance.transfer(toAddress, value, { from: ContractDC.getAccount() });
  }

  attachTokenTransferEvent(instance) {
    const transferEvent = instance.Transfer({}, { fromBlock: 0, toBlock: 'latest' });
    transferEvent.watch(this.transferEventHandler.bind(this));
  }

  async transferEventHandler(error, event: RayonEvent<TransferArgs>) {
    if (error) console.error(error);
    const block = await new Promise<any>((resolve, reject) => {
      ContractDC.getWeb3().eth.getBlock(event.blockNumber, (err, _result) => {
        if (err) reject(err);
        resolve(_result);
      });
    });
    const newDate = new Date(block.timestamp * 1000);
    const newBlockTime: BlockTime = {
      timestamp: block.timestamp * 1000,
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      date: newDate.getDate(),
    };

    const newEvent: TransferEvent = {
      txHash: event.transactionHash,
      blockNumber: event.blockNumber,
      blockTime: newBlockTime,
      from: event.args.from,
      to: event.args.to,
      amount: event.args.value.toNumber(),
    };

    this.transferEvents.push(newEvent);
    this.notifyTransferEvent(this.transferEvents);
  }

  notifyTransferEvent(events: TransferEvent[]) {
    const keys = Object.keys(this.transferEventListeners);
    keys.forEach(item => this.transferEventListeners[item](events));
  }

  subscribeTransferEvent(componentName: string, listener: (events: TransferEvent[]) => void) {
    this.transferEventListeners[componentName] === undefined
      ? (this.transferEventListeners[componentName] = listener)
      : console.error('Listener ' + componentName + ' is already Existing, check your code');
  }

  unsubscribeTransferEvent(componentName: string) {
    this.transferEventListeners[componentName] === undefined
      ? console.error('Listener ' + componentName + ' is undefined, check your code')
      : delete this.transferEventListeners[componentName];
  }
}

export default new TokenDC();
