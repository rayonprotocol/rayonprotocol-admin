import React, { Component } from 'react';

// model
import { EventLog, FunctionLog, MintParameter } from '../../../../shared/common/model/TxLog';

// util
import DateUtil from '../../../../shared/common/util/DateUtil';

interface ContractMethodLogViewProps {
  functionLogs: FunctionLog[];
}

class ContractMethodLogView extends Component<ContractMethodLogViewProps, {}> {
  getInputData(inputData: string) {
    const mintParameter: MintParameter = JSON.parse(inputData);
    return JSON.stringify(mintParameter);
    // return '';
  }

  render() {
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
                  <td>{'status'}</td>
                  <td>{functionLog.functionName}</td>
                  <td>{this.getInputData(functionLog.inputData)}</td>
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
