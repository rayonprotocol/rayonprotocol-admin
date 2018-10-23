import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';
import 'react-table/react-table.css';

// model
import { Holder } from '../../../../shared/token/model/Token';

// view
import SectionTitle from 'common/view/section/SectionTitle';
import DoughnutChart from 'common/view/chart/DoughnutChart';

// styles
import styles from './TokenHolderView.scss';

interface TokenHolderViewProps {
  holders: Holder[];
  onClickHistory: (contractAddr: string) => void;
}

class TokenHolderView extends Component<TokenHolderViewProps, {}> {
  backgroundColor = [
    'rgba(119, 151, 255,0.7)',
    'rgba(109,170,232,0.7)',
    'rgba(132,215,255,0.7)',
    'rgba(119,255,213,0.7)',
    'rgba(109,132,229,0.7)',
    'rgba(207,153,255,0.7)',
    'rgba(174,159,232,0.7)',
    'rgba(188,195,255,0.7)',
    'rgba(159,190,232,0.7)',
    'rgba(175,234,255,0.7)',
  ];

  renderHoldersGraph() {
    const topHolders = this.props.holders.length > 10 ? this.props.holders.slice(0, 10) : this.props.holders;
    const data = topHolders.map(holder => holder.balance);
    const label = topHolders.map(holder => holder.address);
    return (
      <DoughnutChart
        className={styles.holderChart}
        data={data}
        labels={label}
        backgroundColor={this.backgroundColor}
        borderColor={this.backgroundColor}
        height={300}
      />
    );
  }

  renderHoldersTable() {
    return (
      <ReactTable
        data={this.props.holders}
        filterable
        defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
        columns={[
          {
            Header: 'Rank',
            id: 'row',
            maxWidth: 120,
            filterable: false,
            Cell: row => {
              return <div>{row.index + 1}</div>;
            },
            style: {
              textAlign: 'center',
            },
          },
          {
            Header: 'Address',
            accessor: 'address',
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['address'] }),
            filterAll: true,
          },
          {
            Header: 'Balance',
            accessor: 'balance',
            maxWidth: 160,
            filterable: false,
            Cell: row => {
              return <div>{`${row.value} RYN`}</div>;
            },
            style: {
              textAlign: 'center',
            },
          },
          {
            Header: 'History',
            maxWidth: 100,
            filterable: false,
            Cell: row => (
              <div className={styles.historyBtn} onClick={() => this.props.onClickHistory(row.original.address)}>
                <span>&#x2295;</span>
              </div>
            ),
            style: {
              padding: '0',
              cursor: 'pointer',
            },
          },
        ]}
        defaultPageSize={5}
        className={'-striped -highlight'}
      />
    );
  }

  render() {
    return (
      <div className={styles.tokenHolderView}>
        <SectionTitle title={'Token Holders'} />
        <div className={styles.holderViewBody}>
          <div className={styles.holderGraph}>{this.renderHoldersGraph()}</div>
          <div className={styles.holdersTable}>{this.renderHoldersTable()}</div>
        </div>
      </div>
    );
  }
}

export default TokenHolderView;
