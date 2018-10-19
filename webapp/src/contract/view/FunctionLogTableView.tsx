import React, { Component } from 'react';

// model
import { EventLog, FunctionLog } from '../../../../shared/common/model/TxLog';

// util
import DateUtil from '../../../../shared/common/util/DateUtil';
import StringUtil from '../../../../shared/common/util/StringUtil';

interface FunctionLogTableViewProps {
  functionLogs: FunctionLog[];
}

class FunctionLogTableView extends Component<FunctionLogTableViewProps, {}> {
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

  render() {
    return (
      <table>
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
      </table>
    );
  }
}

export default FunctionLogTableView;
