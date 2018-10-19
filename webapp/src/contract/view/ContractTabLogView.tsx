import React, { Component, Fragment } from 'react';

// model
import { FunctionLog, EventLog } from '../../../../shared/common/model/TxLog';

// vc
import ContractVC from 'contract/vc/ContractVC';

// util
import DateUtil from '../../../../shared/common/util/DateUtil';
import StringUtil from '../../../../shared/common/util/StringUtil';

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
      const input =
        typeof inputs[inputKey] === 'string' && inputs[inputKey].startsWith('0x')
          ? StringUtil.trimAddress(inputs[inputKey])
          : inputs[inputKey];
      return <p key={index}>{`${inputKey}: ${input}`}</p>;
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

  renderTitleAndTabView() {
    return (
      <div className={styles.logTitleSection}>
        <div className={styles.title}>{'Transaction Log'}</div>
        <div className={styles.tabs}>
          <div className={styles.tab}>Event</div>
          <div className={styles.tab}>Function</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.contractLogView}>
        {this.renderTitleAndTabView()}
        <table>
          {this.props.currentTab === ContractVC.TAB_FUNCTION ? this.renderEventLog() : this.renderFunctionLog()}
        </table>
      </div>
    );
  }
}

export default ContractTabLogView;
