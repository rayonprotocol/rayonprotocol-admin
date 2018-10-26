import React, { Component } from 'react';

// model
import { EventLog, FunctionLog } from '../../../../shared/common/model/TxLog';
import Contract from '../../../../shared/contract/model/Contract';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

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
  contracts: Contract[];
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
    };
  }

  async componentDidMount() {
    ContractDC.addContractListener(this.onContractFetched.bind(this));
    ContractDC.fetchAllContracts();
  }

  public async onContractFetched(contracts: Contract[]) {
    const selContractAddr = ContractDC.getFirstContractAddr();
    const eventLogs = await ContractDC.getEventLogs(selContractAddr);
    const functionLogs = await ContractDC.getFunctionLogs(selContractAddr);
    this.setState({ ...this.state, contracts, eventLogs, functionLogs, selContractAddr });
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

  renderLogTable() {
    const { selLogType } = this.state;
    switch (selLogType) {
      case ContractVC.TAB_EVENT:
        return <EventLogTableView eventLogs={this.state.eventLogs} />;
      case ContractVC.TAB_FUNCTION:
        return <FunctionLogTableView functionLogs={this.state.functionLogs} />;

      default:
        break;
    }
  }

  render() {
    return (
      <Container className={styles.contractVC}>
        {this.state.contracts && (
          <ContractOverviewView
            contracts={this.state.contracts}
            selContractAddr={this.state.selContractAddr}
            onSelectContract={this.onSelectContract.bind(this)}
          />
        )}

        <ContractLogView
          selLogType={this.state.selLogType}
          logTypes={[ContractVC.TAB_FUNCTION, ContractVC.TAB_EVENT]}
          onSelectLogType={this.onSelectLogType.bind(this)}
        >
          {this.state.eventLogs && this.state.functionLogs && this.renderLogTable()}
        </ContractLogView>
      </Container>
    );
  }
}

export default ContractVC;
