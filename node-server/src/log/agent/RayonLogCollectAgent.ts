import Web3 from 'web3';
import { resolve } from 'dns';
import 'core-js/modules/es7.symbol.async-iterator'; // for async iterator

// agent
import RayonArtifactAgent from './RayonArtifactAgent';
import RayonLogDbAgent from './RayonLogDbAgent';

// model
import { Block, Transaction, TxReceipt } from '../../common/model/Web3Type';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import { RayonEvent } from '../../../../shared/token/model/Token';
import TxLog, { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';
import { ABI_TYPE_FUNCTION, ABI_TYPE_EVENT, getRayonContracts } from '../../../../shared/contract/model/Contract';

// util
import ContractUtil from '../../common/util/ContractUtil';
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';
import Web3Controller from '../../common/controller/Web3Controller';

class RayonLogCollectAgent {
  private SIGNITURE_INDEX = 0;

  private _latestBlock: number;
  private _readLastBlockNumber: number;

  public async collectionStart() {
    this._collectLog();
    setTimeout(() => {
      this._collectLog();
    }, 4000);

    // setInterval(this._collectLog.bind(this), ContractConfigure.AUTOMAITC_REQUEST_TIME_INTERVAL);
    // for await (const rayonContractTxLogs of this._getRayonTxLogsInBlocks()) {
    //   console.log('rayonContractTxLogs', rayonContractTxLogs);
    //   RayonLogDbAgent.storeTxLogs(rayonContractTxLogs);
    // }
  }

  private async _collectLog() {
    // this._latestBlock = await this._getLatestBlockNumber();
    // this._readLastBlockNumber = await this._getReadLastBlockNumber();

    const latestBlockNumber = await this._getLatestBlockNumber();
    const readLastBlockNumber =
      this._readLastBlockNumber === undefined ? ContractConfigure.CONTRACTBLOCK_TESTNET : this._readLastBlockNumber + 1;

    if (this._readLastBlockNumber !== latestBlockNumber)
      this._getRayonTxLogsInBlocks(readLastBlockNumber, latestBlockNumber);

    this._readLastBlockNumber = latestBlockNumber;
    // for (let i = this._readLastBlockNumber; i <= this._latestBlock; i++) {
    //   // console.log((await Web3Controller.getWeb3().eth.getBlock(i)).number);
    //   await this._getRayonTxLogsInBlocks(i);
    // }
  }

  // private async _getReadLastBlockNumber() {
  //   const readLastBlockNumber = (await RayonLogDbAgent.getReadLastBlock())[0]['MAX(block_number)'];
  //   return readLastBlockNumber === null ? ContractConfigure.CONTRACTBLOCK_TESTNET : readLastBlockNumber;
  // }

  private async _getLatestBlockNumber() {
    const latestBlock = await Web3Controller.getWeb3().eth.getBlock('latest');
    return latestBlock.number;
  }

  private async _getRayonTxLogsInBlocks(startNumber: number, endNumber: number) {
    for (let i = startNumber; i <= endNumber; i++) {
      console.log((await Web3Controller.getWeb3().eth.getBlock(i)).number);
      // await this._getRayonTxLogsInBlocks(i);
    }
    // console.log((await Web3Controller.getWeb3().eth.getBlock(blockNumber)).number);
    // const readLastBlock: Block = await Web3Controller.getWeb3().eth.getBlock(blockNumber);
    // console.log(readLastBlock);
  }

  // private async *_getRayonTxLogsInBlocks(): AsyncIterableIterator<TxLog[]> {
  //   this._readLastBlockNumber = await this._getReadLastBlockNumber();

  //   while (true) {
  //     const latestBlock = await Web3Controller.getWeb3().eth.getBlock('latest');
  //     const readLastBlock: Block = await Web3Controller.getWeb3().eth.getBlock(this._readLastBlockNumber + 1);
  //     console.log(readLastBlock.number);
  //     if (readLastBlock.number === latestBlock.number) {
  //       await this._sleep(ContractConfigure.AUTOMAITC_REQUEST_TIME_INTERVAL);
  //       continue;
  //     }

  //     const rayonContractTxLogs = await this._getRayonContractTxLogs(readLastBlock);

  //     if (rayonContractTxLogs.length) yield rayonContractTxLogs;
  //     this._readLastBlockNumber++;
  //   }
  // }

  // private async _getRayonContractTxLogs(currentBlock: Block): Promise<TxLog[]> {
  //   const txLog: TxLog[] = await Promise.all(
  //     currentBlock.transactions.map(async transactionHash => {
  //       const transaction: Transaction = await Web3Controller.getWeb3().eth.getTransaction(transactionHash);
  //       const isRayonContract: boolean = await RayonLogDbAgent.isRayonContract(transaction.to);
  //       if (!isRayonContract) return;

  //       const txReceipt: TxReceipt = await Web3Controller.getWeb3().eth.getTransactionReceipt(transaction.hash);
  //       return await this._makeTxLog(transaction, txReceipt, currentBlock);
  //     })
  //   );

  //   return ArrayUtil.removeUndefinedElements(txLog);
  // }

  // private async _makeTxLog(transaction: Transaction, txReceipt: TxReceipt, currentBlock: Block): TxLog {
  //   const contractAddress = transaction.to.toLowerCase();

  //   const functionSignature = transaction.input.slice(0, 10).toLowerCase();
  //   const functionParameter = transaction.input.slice(10).toLowerCase();

  //   const functionLog: FunctionLog = {
  //     blockNumber: transaction.blockNumber,
  //     txHash: transaction.hash,
  //     calledTime: currentBlock.timestamp,
  //     status: txReceipt.status,
  //     contractAddress,
  //     functionName: await RayonLogDbAgent.getFullName(contractAddress, functionSignature, ABI_TYPE_FUNCTION),
  //     inputData: JSON.stringify(
  //       await RayonLogDbAgent.getParameters(contractAddress, functionSignature, functionParameter, ABI_TYPE_FUNCTION)
  //     ),
  //     urlEtherscan: this._getEtherscanUrl(transaction.hash),
  //     environment: process.env.ENV_BLOCKCHAIN,
  //   };
  //   const eventLogs: Promise<EventLog[]> = txReceipt.logs.map(async log => {
  //     const eventSignature = log.topics[this.SIGNITURE_INDEX].toLowerCase();
  //     const eventParameter = this._getEventParameter(log.topics, log.data);
  //     return {
  //       ...functionLog,
  //       eventName: await RayonLogDbAgent.getFullName(contractAddress, eventSignature, ABI_TYPE_EVENT),
  //       inputData: JSON.stringify(
  //         await RayonLogDbAgent.getParameters(contractAddress, eventSignature, eventParameter, ABI_TYPE_EVENT)
  //       ),
  //     };
  //   });
  //   return {
  //     functionLog,
  //     eventLogs,
  //   };
  // }

  // private _getEtherscanUrl(txHash: string) {
  //   if (process.env.ENV_BLOCKCHAIN === ContractConfigure.ENV_LOCAL) return '';
  //   if (process.env.ENV_BLOCKCHAIN === ContractConfigure.ENV_MAIN) return `https://etherscan.io/tx/${txHash}`;
  //   else return `https://${process.env.ENV_BLOCKCHAIN}.etherscan.io/tx/${txHash}`;
  // }

  // private _getEventParameter(topics: string[], data: string) {
  //   if (topics.length === 0) return;
  //   return (
  //     topics.map((topic, index) => (index === this.SIGNITURE_INDEX ? undefined : topic.slice(2))).join('') +
  //     data.slice(2)
  //   );
  // }

  private _sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}

export default new RayonLogCollectAgent();
