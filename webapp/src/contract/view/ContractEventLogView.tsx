import React, { Component } from 'react';

// model
import { EventLog } from '../../../../shared/common/model/TxLog';

// util
import DateUtil from '../../../../shared/common/util/DateUtil';

// styles
import styles from './ContractEventLogView.scss';

interface ContractEventLogViewProps {
  eventLogs: EventLog[];
}

class ContractEventLogView extends Component<ContractEventLogViewProps, {}> {
  renderInputs(inputData: string) {
    const inputs = JSON.parse(inputData);
    return Object.keys(inputs).map((inputKey, index) => {
      return (
        <p key={index}>
          <span>{`${inputKey}: `}</span>
          <span>{inputs[inputKey]}</span>
        </p>
      );
    });
  }

  render() {
    return (
      <div className={styles.eventLogView}>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Method</th>
              <th>Event</th>
              <th>Parameter</th>
              <th>Age</th>
              <th>Eterscan</th>
            </tr>
          </thead>
          <tbody>
            {this.props.eventLogs.map((functionLog, index) => {
              return (
                <tr key={index}>
                  <td>{functionLog.status}</td>
                  <td>{functionLog.functionName}</td>
                  <td>{functionLog.eventName}</td>
                  <td>{this.renderInputs(functionLog.inputData)}</td>
                  <td>{DateUtil.timstampCommonFormConverter(functionLog.calledTime)}</td>
                  <td>
                    <a href={functionLog.urlEtherscan}>></a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ContractEventLogView;
