import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';

// dc
import TransferEventDC from 'event/dc/TransferEventDC';

// model
import { TransferEvent } from '../../../../shared/event/model/RayonEvent';

// view
import LinearChart from 'common/view/chart/LinearChart';
import RayonButton from 'common/view/button/RayonButton';
import DashboardContainer from 'common/view/container/DashboardContainer';

// styles
import styles from './TransactionView.scss';

interface TransactionViewState {
  labels: string[];
  chartData: number[];
  transferEvents: TransferEvent[];
}

class TransactionView extends Component<{}, TransactionViewState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      labels: [],
      chartData: [],
      transferEvents: [],
    };
  }

  componentWillMount() {
    TransferEventDC.subscribeEvent(TransactionView.name, this.getTransferEvent.bind(this));
  }

  componentWillUnmount() {
    TransferEventDC.unsubscribeEvent(TransactionView.name);
  }

  async getTransferEvent(event: TransferEvent[]) {
    const transferEvents = event.length >= 5 ? event.slice(-5).reverse() : event;
    const { labels, chartData } = await TransferEventDC.fetchChartData();
    this.setState({ ...this.state, transferEvents, labels, chartData });
  }

  onClickDetailButton() {
    console.log('click');
  }

  render() {
    const { transferEvents, labels, chartData } = this.state;
    console.log('transferEvents!!', transferEvents);
    return (
      <DashboardContainer className={styles.transactionView} title={'Transactions'}>
        <LinearChart data={chartData} labels={labels} height={300} />
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
            {transferEvents.map((item, index) => {
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
                      <span>{moment(item.blockTime.timestamp).fromNow()}</span>
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
        />
      </DashboardContainer>
    );
  }
}

export default TransactionView;
