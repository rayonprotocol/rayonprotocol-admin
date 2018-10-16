import Web3 from 'web3';
import { resolve } from 'dns';
import 'core-js/modules/es7.symbol.async-iterator'; // for async iterator

// agent
import RayonArtifactAgent from './RayonArtifactAgent';
import RayonLogStoreAgent from './RayonLogStoreAgent';

// model
import { Block, Transaction, TxReceipt } from '../../common/model/Web3Type';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import { RayonEvent } from '../../../../shared/token/model/Token';
import TxLog, { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';

// util
import ContractUtil from '../../common/util/ContractUtil';
import ArrayUtil from '../../../../shared/common/util/ArrayUtil';

class RayonLogCollectAgent {
  private SIGNITURE_INDEX = 0;

  private _web3: Web3;
  private _contracts: string[];
  private _readLastBlockNumber: number;

  constructor() {
    this._setWeb3();
    this._contracts = Array.from(ContractConfigure.getRayonContractAddresses().values());
  }

  public async collectionStart() {
    for await (const rayonContractTxLogs of this._getRayonTxLogsInBlocks()) {
      console.log('rayonContractTxLogs', rayonContractTxLogs);
      RayonLogStoreAgent.storeTxLogs(rayonContractTxLogs);
    }
  }

  private async _getReadLastBlockNumber() {
    const readLastBlockNumber = (await RayonLogStoreAgent.getLatestBlock())[0]['MAX(block_number)'];
    return readLastBlockNumber === null ? ContractConfigure.CONTRACTBLOCK_TESTNET : readLastBlockNumber;
    // return readLastBlockNumber === null ? 4050019 : readLastBlockNumber;
  }

  private _setWeb3(): void {
    const Web3 = require('web3');
    this._web3 = new Web3(ContractUtil.getHttpProvider());
  }

  private async *_getRayonTxLogsInBlocks(): AsyncIterableIterator<TxLog[]> {
    this._readLastBlockNumber = await this._getReadLastBlockNumber();

    while (true) {
      const latestBlock = await this._web3.eth.getBlock('latest');
      const readLastBlock: Block = await this._web3.eth.getBlock(this._readLastBlockNumber + 1);
      console.log(readLastBlock.number);
      if (readLastBlock.number === latestBlock.number) {
        await this._sleep(ContractConfigure.AUTOMAITC_REQUEST_TIME_INTERVAL);
        continue;
      }

      const rayonContractTxLogs = await this._getRayonContractTxLogs(readLastBlock);

      if (rayonContractTxLogs.length) yield rayonContractTxLogs;
      this._readLastBlockNumber++;
    }
  }

  private async _getRayonContractTxLogs(currentBlock: Block): Promise<TxLog[]> {
    const txLog: TxLog[] = await Promise.all(
      currentBlock.transactions.map(async transactionHash => {
        const transaction: Transaction = await this._web3.eth.getTransaction(transactionHash);
        if (!this._isRayonContractTx(transaction.to)) return;

        const txReceipt: TxReceipt = await this._web3.eth.getTransactionReceipt(transaction.hash);
        return this._makeTxLog(transaction, txReceipt, currentBlock);
      })
    );

    return ArrayUtil.removeUndefinedElements(txLog);
  }

  private _isRayonContractTx(txContractAddress: string) {
    const contractAddress = txContractAddress !== null && txContractAddress.toLowerCase();
    return this._contracts.indexOf(contractAddress) > -1;
  }

  private _makeTxLog(transaction: Transaction, txReceipt: TxReceipt, currentBlock: Block): TxLog {
    const contractAddress = transaction.to.toLowerCase();

    const functionSignature = transaction.input.slice(0, 10).toLowerCase();
    const functionParameter = transaction.input.slice(10).toLowerCase();

    const functionLog: FunctionLog = {
      blockNumber: transaction.blockNumber,
      txHash: transaction.hash,
      calledTime: currentBlock.timestamp,
      status: txReceipt.status,
      contractAddress,
      functionName: RayonArtifactAgent.getFunctionFullName(contractAddress, functionSignature),
      inputData: JSON.stringify(
        RayonArtifactAgent.getFunctionParameters(contractAddress, functionSignature, functionParameter)
      ),
      urlEtherscan: this._getEtherscanUrl(transaction.hash),
      environment: process.env.ENV_BLOCKCHAIN,
    };
    const eventLogs: EventLog[] = txReceipt.logs.map(log => {
      const eventSignature = log.topics[this.SIGNITURE_INDEX].toLowerCase();
      const eventParameter = this._getEventParameter(log.topics, log.data);
      return {
        ...functionLog,
        eventName: RayonArtifactAgent.getEventFullName(contractAddress, eventSignature),
        inputData: JSON.stringify(
          RayonArtifactAgent.getEventParameters(contractAddress, eventSignature, eventParameter)
        ),
      };
    });
    return {
      functionLog,
      eventLogs,
    };
  }

  private _getEtherscanUrl(txHash: string) {
    if (process.env.ENV_BLOCKCHAIN === ContractConfigure.ENV_LOCAL) return '';
    if (process.env.ENV_BLOCKCHAIN === ContractConfigure.ENV_MAIN) return `https://etherscan.io/tx/${txHash}`;
    else return `https://${process.env.ENV_BLOCKCHAIN}.etherscan.io/tx/${txHash}`;
  }

  private _getEventParameter(topics: string[], data: string) {
    if (topics.length === 0) return;
    return (
      topics.map((topic, index) => (index === this.SIGNITURE_INDEX ? undefined : topic.slice(2))).join('') +
      data.slice(2)
    );
  }

  private _sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}

export default new RayonLogCollectAgent();
