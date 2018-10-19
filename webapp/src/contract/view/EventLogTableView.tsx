import React, { Component } from 'react';

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
      </table>
    );
  }
}

export default EventLogTableView;
