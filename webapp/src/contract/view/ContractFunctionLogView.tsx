import React, { Component } from 'react';

// model
import { EventLog, FunctionLog, MintParameter } from '../../../../shared/common/model/TxLog';

// util
import DateUtil from '../../../../shared/common/util/DateUtil';

interface ContractMethodLogViewProps {
  functionLogs: FunctionLog[];
}

class ContractMethodLogView extends Component<ContractMethodLogViewProps, {}> {
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
    console.log(this.props.functionLogs);
    return (
      <div>
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
      </div>
    );
  }
}

export default ContractMethodLogView;
