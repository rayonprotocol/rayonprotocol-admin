import React, { Component } from 'react';
import classNames from 'classnames';
import Web3 from 'web3';
import moment from 'moment';

// dc
import ContractDC from 'common/dc/ContractDC';
import TokenDC from 'token/dc/TokenDC';

// model
import { TransferEvent } from 'token/model/Token';

// view
import LinearChart from 'common/view/chart/LinearChart';
import DashboardContainer from 'common/view/container/DashboardContainer';
import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './TransactionView.scss';

interface TransactionViewState {
  labels: string[];
  data: number[];
  transferDate: Object;
  transferEvents: TransferEvent[];
}

class TransactionView extends Component<{}, TransactionViewState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      labels: ['2018&6/16', '2018&6/17'],
      data: [4, 1],
      transferEvents: [],
      transferDate: {},
    };
  }

  componentWillMount() {
    TokenDC.setWatchTransferEventListener(this.getTransferEvent.bind(this));
    TokenDC.watchTransferEvent();
  }

  componentWillUnmount() {
    TokenDC.stopWatchTransferEvent();
  }

  async getTransferEvent(error, event) {
    const { transferEvents, transferDate } = this.state;
    const web3: Web3 = ContractDC.getWeb3();

    const result = await new Promise<any>((resolve, reject) => {
      web3.eth.getBlock(event['blockNumber'], (err, _result) => {
        if (err) reject(err);
        resolve(_result);
      });
    });

    const newEvent = {
      txHash: event['transactionHash'],
      blockNumber: event['blockNumber'],
      timestamp: result.timestamp,
      from: event['args']['from'],
      to: event['args']['to'],
      amount: event['args']['value'].toNumber(),
    };

    // save new transfer transaction event
    transferEvents.push(newEvent);
    transferEvents.sort((a, b) => a.timestamp - b.timestamp);

    // save number of transfer transaction
    const blockDate = new Date(newEvent.timestamp * 1000);
    const dateKey = blockDate.getFullYear() + '&' + blockDate.getMonth() + '/' + blockDate.getDate();
    transferDate[dateKey] = transferDate[dateKey] === undefined ? 1 : transferDate[dateKey] + 1;

    this.setState({ ...this.state, transferEvents, transferDate });
  }

  onClickDetailButton() {
    console.log('click');
  }

  render() {
    const { transferEvents, transferDate } = this.state;
    const sortedLabelList = Object.keys(this.state.transferDate).sort();
    const topTransferEvents = transferEvents.length >= 5 ? transferEvents.reverse().slice(-5) : transferEvents;
    const labels = sortedLabelList.length >= 10 ? sortedLabelList.slice(-10) : sortedLabelList;
    const data = labels.map(item => transferDate[item]);

    return (
      <DashboardContainer className={styles.transactionView} title={'Transactions'}>
        <LinearChart data={data} labels={labels} height={300} />
        <div>
          <p className={styles.subTitle}>Transactions</p>
          <table className={styles.transactionTable}>
            <thead className={classNames(styles.tableRow, styles.headerRow)}>
              <tr>
                <th className={styles.txHash}>
                  <span>TxHash</span>
                </th>
                <th className={styles.block}>
                  <span>Block</span>
                </th>
                <th className={styles.timestamp}>
                  <span>Age</span>
                </th>
                <th className={styles.from}>
                  <span>From</span>
                </th>
                <th className={styles.to}>
                  <span>To</span>
                </th>
                <th className={styles.value}>
                  <span>Value</span>
                </th>
              </tr>
            </thead>
            {topTransferEvents.map((item, index) => {
              return (
                <tbody key={index} className={classNames(styles.tableRow, styles.transactionRow)}>
                  <tr>
                    <td className={styles.txHash}>
                      <span>{item.txHash}</span>
                    </td>
                    <td className={styles.block}>
                      <span>{item.blockNumber}</span>
                    </td>
                    <td className={styles.timestamp}>
                      <span>{moment(item.timestamp * 1000).fromNow()}</span>
                    </td>
                    <td className={styles.from}>
                      <span>{item.from}</span>
                    </td>
                    <td className={styles.to}>
                      <span>{item.to}</span>
                    </td>
                    <td className={styles.value}>
                      <span>{item.amount}</span>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
        <RayonButton
          className={styles.detailBtn}
          title={'Detail'}
          onClickButton={this.onClickDetailButton.bind(this)}
          isBorrower={true}
        />
      </DashboardContainer>
    );
  }
}

export default TransactionView;
