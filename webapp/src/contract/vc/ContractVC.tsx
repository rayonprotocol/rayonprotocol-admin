import React, { Component } from 'react';

// model
import { EventLog, FunctionLog } from '../../../../shared/common/model/TxLog';
import { ContractOverview } from '../../../../shared/contract/model/Contract';

// dc
import ContractDC from 'contract/dc/ContractDC';

// view
import Container from 'common/view/container/Container';
import ContractOverviewView from 'contract/view/ContractOverviewView';
import ContractLogView from 'contract/view/ContractLogView';

import FunctionLogTableView from 'contract/view/FunctionLogTableView';
import EventLogTableView from 'contract/view/EventLogTableView';

// styles
import styles from './ContractVC.scss';

interface ContractVCState {
  functionLogs: FunctionLog[];
  eventLogs: EventLog[];
  selLogType: string;
  contractOverviews: ContractOverview;
  selContractAddr: string;
}

class ContractVC extends Component<{}, ContractVCState> {
  public static TAB_FUNCTION = 'Function';
  public static TAB_EVENT = 'Event';

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      functionLogs: new Array<FunctionLog>(),
      eventLogs: new Array<EventLog>(),
      selLogType: ContractVC.TAB_FUNCTION,
      contractOverviews: contract.getAllContractOverview(),
      selContractAddr: contract.getContractAddressList()[0],
    };
  }

  async componentWillMount() {
    const eventLogs = await ContractDC.getEventLogs(this.state.selContractAddr);
    const functionLogs = await ContractDC.getFunctionLogs(this.state.selContractAddr);
    this.setState({ ...this.state, eventLogs, functionLogs });
  }

  public async onSelectContract(selContractAddr: string): Promise<void> {
    if (this.state.selContractAddr === selContractAddr) return;

    const eventLogs = await ContractDC.getEventLogs(selContractAddr);
    const functionLogs = await ContractDC.getFunctionLogs(selContractAddr);
    this.setState({ ...this.state, eventLogs, functionLogs, selContractAddr });
  }

  public onSelectLogType(type: string): void {
    this.setState({ ...this.state, selLogType: type });
  }

  render() {
    return (
      <Container className={styles.contractVC}>
        <ContractOverviewView
          contractOverviews={this.state.contractOverviews}
          selContractAddr={this.state.selContractAddr}
          onSelectContract={this.onSelectContract.bind(this)}
        />
        <ContractLogView
          selLogType={this.state.selLogType}
          logTypes={[ContractVC.TAB_FUNCTION, ContractVC.TAB_EVENT]}
          onSelectLogType={this.onSelectLogType.bind(this)}
        >
          {this.state.selLogType === ContractVC.TAB_EVENT ? (
            <EventLogTableView eventLogs={this.state.eventLogs} />
          ) : (
            <FunctionLogTableView functionLogs={this.state.functionLogs} />
          )}
        </ContractLogView>
      </Container>
    );
  }
}

export default ContractVC;
