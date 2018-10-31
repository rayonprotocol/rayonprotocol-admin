import React, { Component } from 'react';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';
import 'react-table/react-table.css';

// model
import { TokenHistory } from '../../../../shared/token/model/Token';

// view
import SectionTitle from 'common/view/section/SectionTitle';

// util
import DateUtil from '../../../../shared/common/util/DateUtil';
import ContractUtil from '../../../../shared/common/util/ContractUtil';

// styles
import styles from './TokenHolderLogView.scss';

interface TokenHolderLogViewProps {
  selUserAddr: string;
  tokenHistory: TokenHistory[];
}

class TokenHolderLogView extends Component<TokenHolderLogViewProps, {}> {
  render() {
    return (
      <div className={styles.tokenHolderLogView}>
        <SectionTitle title={'Token Holder Log'} />
        <ReactTable
          data={this.props.tokenHistory}
          filterable
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
          columns={[
            {
              Header: 'No.',
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
              Header: 'Type',
              id: 'type',
              maxWidth: 140,
              filterable: false,
              Cell: row => (
                <span>
                  <span
                    style={{
                      color: row.original.from === this.props.selUserAddr ? '#b43664' : '#046d86',
                      transition: 'all .3s ease',
                    }}
                  >
                    &#x25cf;
                  </span>{' '}
                  {row.original.from === this.props.selUserAddr ? 'Send' : 'Receive'}
                </span>
              ),
            },
            {
              Header: 'Address',
              accessor: 'address',
              filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['address'] }),
              filterAll: true,
              Cell: row => (
                <span>
                  <span>{row.original.from === this.props.selUserAddr ? row.original.to : row.original.from}</span>
                </span>
              ),
            },
            {
              Header: 'Amount',
              accessor: 'amount',
              maxWidth: 150,
              filterable: false,
              Cell: row => {
                return <div>{`${ContractUtil.weiToToken(row.value).toFixed(4)} RYN`}</div>;
              },
              style: {
                textAlign: 'center',
              },
            },
            {
              Header: 'Age',
              accessor: 'calledTime',
              filterable: false,
              maxWidth: 150,
              Cell: row => <div>{DateUtil.timstampCommonFormConverter(row.value)}</div>,
              style: {
                textAlign: 'center',
              },
            },
          ]}
          defaultPageSize={5}
          className={'-striped -highlight'}
        />
      </div>
    );
  }
}

export default TokenHolderLogView;
