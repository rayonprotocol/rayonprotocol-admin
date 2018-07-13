import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import classNames from 'classnames';

// dc
import TransactionDC from 'transaction/dc/TransactionDC';

// model
import ChartData from 'common/model/ChartData';
import Transaction from 'transaction/model/Transaction';

// view
import BarChart from 'common/view/chart/BarChart';
import DashboardContainer from 'common/view/container/DashboardContainer';
import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './TransactionView.scss';

interface TransactionViewState {
  labels: string[];
  data: number[];
  transactions: Transaction[];
}

class TransactionView extends Component<{}, TransactionViewState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Green', 'Purple', 'Orange'],
      data: [12, 19, 3, 5, 2, 3, 4, 5, 6, 7],
      transactions: TransactionDC.getTransactions(),
    };
  }

  onClickDetailButton() {
    console.log('click');
  }

  render() {
    const { labels, data, transactions } = this.state;
    const backgroundColor = new Array(this.state.data.length).fill('rgb(0, 151, 198)');
    const borderColor = new Array(this.state.data.length).fill('rgb(0, 151, 198)');
    return (
      <DashboardContainer className={styles.transactionView} title={'Transactions'}>
        <BarChart data={data} labels={labels} backgroundColor={backgroundColor} borderColor={borderColor} height={300} />
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
            {transactions.map((item, index) => {
              return (
                <tbody key={index} className={classNames(styles.tableRow, styles.transactionRow)}>
                  <tr>
                    <td className={styles.txHash}>
                      <span>{item.txHash}</span>
                    </td>
                    <td className={styles.block}>
                      <span>{item.block}</span>
                    </td>
                    <td className={styles.timestamp}>
                      <span>{item.timestamp}</span>
                    </td>
                    <td className={styles.from}>
                      <span>{item.from}</span>
                    </td>
                    <td className={styles.to}>
                      <span>{item.to}</span>
                    </td>
                    <td className={styles.value}>
                      <span>{item.value}</span>
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
