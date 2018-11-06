import React, { Component } from 'react';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';
import 'react-table/react-table.css';

// styles
import styles from './EventLogTableView.scss';

// model
import { EventLog } from '../../../../shared/common/model/TxLog';

// util
import DateUtil from '../../../../shared/common/util/DateUtil';
import StringUtil from '../../../../shared/common/util/StringUtil';

interface EventLogTableViewProps {
  eventLogs: EventLog[];
}

class EventLogTableView extends Component<EventLogTableViewProps, {}> {
  renderInputs(inputData: string) {
    if (StringUtil.isEmpty(inputData)) return 'No Data';
    const inputs = JSON.parse(inputData);
    return Object.keys(inputs).map((inputKey, index) => (
      <p key={index}>
        <span>{inputKey}</span>
        {inputs[inputKey]}
      </p>
    ));
  }

  render() {
    return (
      <div>
        <ReactTable
          data={this.props.eventLogs}
          filterable
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
          columns={[
            {
              Header: 'Status',
              accessor: 'status',
              maxWidth: 130,
              filterable: false,
              Cell: row => (
                <span>
                  <span
                    style={{
                      color: row.value === 0 ? '#ff2e00' : '#57d500',
                      transition: 'all .3s ease',
                    }}
                  >
                    &#x25cf;
                  </span>{' '}
                  {row.value === 0 ? 'Fail' : 'Success'}
                </span>
              ),
            },
            {
              Header: 'Block',
              accessor: 'blockNumber',
              maxWidth: 130,
              filterable: false,
            },
            {
              Header: 'Function',
              accessor: 'functionName',
              filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['functionName'] }),
              filterAll: true,
            },
            {
              Header: 'Event',
              accessor: 'eventName',
              filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['functionName'] }),
              filterAll: true,
            },
            {
              Header: 'Age',
              accessor: 'calledTime',
              maxWidth: 130,
              filterable: false,
              Cell: row => <div>{DateUtil.timstampCommonFormConverter(row.value)}</div>,
            },
            {
              Header: 'More',
              accessor: 'urlEtherscan',
              maxWidth: 60,
              filterable: false,
              Cell: row => (
                <div className={styles.etherscanCursor}>
                  <a href={row.value} target={'_blank'}>
                    <span>&#x2295;</span>
                  </a>
                </div>
              ),
              style: {
                padding: '0',
              },
            },
          ]}
          defaultPageSize={10}
          className={'-striped -highlight'}
          SubComponent={row => {
            return (
              <div className={styles.inputSubComponent}>
                <div className={styles.inputTitle}>{'Event Input'}</div>
                <div className={styles.inputs}>{this.renderInputs(row.original.inputData)}</div>
              </div>
            );
          }}
        />
      </div>
    );
  }
}

export default EventLogTableView;
