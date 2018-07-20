// dc
import ContractDC from '../../common/dc/ContractDC';

// model
import RayonEvent, { TransferArgs, TransferEvent, BlockTime, MintArgs, MintEvent } from '../../event/model/RayonEvent';

class TokenDC {
  mintEvents = [];
  transferEvents = [];

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
  }

  attachTokenTransferEvent(instance) {
    const transferEvent = instance.Transfer({}, { fromBlock: 0, toBlock: 'latest' });
    transferEvent.watch(this.transferEventHandler.bind(this));
  }

  async transferEventHandler(error, event: RayonEvent<TransferArgs>) {
    if (error) console.error(error);
    const block = await ContractDC.getWeb3().eth.getBlock(event.blockNumber);
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
    console.log('transferEvents', this.transferEvents);
  }

  async getBalance() {
    return (await ContractDC.getTokenContractInstance().totalSupply()).toNumber();
  }
}

export default new TokenDC();
