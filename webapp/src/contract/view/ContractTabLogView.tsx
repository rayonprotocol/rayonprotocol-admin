import React, { Component, Fragment } from 'react';

// model
import { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';

// vc
import ContractVC from 'contract/vc/ContractVC';

// util
import DateUtil from '../../../../shared/common/util/DateUtil';

// styles
import styles from './ContractTabLogView.scss';

interface ContractTabLogViewProps {
  functionLogs: FunctionLog[];
  eventLogs: EventLog[];
  currentTab: string;
}

class ContractTabLogView extends Component<ContractTabLogViewProps, {}> {
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

  renderEventLog() {
    return (
      <Fragment>
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
          {this.props.eventLogs.map((eventLog, index) => {
            return (
              <tr key={index}>
                <td>{eventLog.status}</td>
                <td>{eventLog.functionName}</td>
                <td>{eventLog.eventName}</td>
                <td>{this.renderInputs(eventLog.inputData)}</td>
                <td>{DateUtil.timstampCommonFormConverter(eventLog.calledTime)}</td>
                <td>
                  <a href={eventLog.urlEtherscan}>></a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Fragment>
    );
  }

  renderFunctionLog() {
    return (
      <Fragment>
        <thead>
          <tr>
            <th>Status</th>
            <th>Method</th>
            <th>Parameter</th>
            <th>Age</th>
            <th>Eterscan</th>
          </tr>
        </thead>
        <tbody>
          {this.props.functionLogs.map((functionLog, index) => {
            return (
              <tr key={index}>
                <td>{functionLog.status}</td>
                <td>{functionLog.functionName}</td>
                <td>{this.renderInputs(functionLog.inputData)}</td>
                <td>{DateUtil.timstampCommonFormConverter(functionLog.calledTime)}</td>
                <td>
                  <a href={functionLog.urlEtherscan}>></a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Fragment>
    );
  }

  render() {
    return (
      <div className={styles.logView}>
        <table>
          {this.props.currentTab === ContractVC.TAB_FUNCTION ? this.renderEventLog() : this.renderFunctionLog()}
        </table>
      </div>
    );
  }
}

export default ContractTabLogView;
