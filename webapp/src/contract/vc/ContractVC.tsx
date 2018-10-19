import React, { Component } from 'react';

// model
import { EventLog, FunctionLog } from '../../../../shared/common/model/TxLog';
import Contract, { ContractOverview } from '../../../../shared/contract/model/Contract';

// dc
import ContractDC from 'contract/dc/ContractDC';

// view
import Container from 'common/view/container/Container';
import ContractTopView from 'contract/view/ContractTopView';
import ContractTabLogView from 'contract/view/ContractTabLogView';
import RayonTab from 'common/view/tab/RayonTab';

import styles from './ContractVC.scss';

interface ContractVCState {
  functionLogs: FunctionLog[];
  eventLogs: EventLog[];
  currentTab: string;
  contractOverviews: ContractOverview;
  selContractAddr: string;
}

class ContractVC extends Component<{}, ContractVCState> {
  public static TAB_FUNCTION = 'Function';
  public static TAB_EVENT = 'Event';

  private _tabs = [ContractVC.TAB_FUNCTION, ContractVC.TAB_EVENT];

  constructor(props) {
    super(props);
    const contract = new Contract();
    this.state = {
      ...this.state,
      functionLogs: new Array<FunctionLog>(),
      eventLogs: new Array<EventLog>(),
      currentTab: ContractVC.TAB_FUNCTION,
      contractOverviews: contract.getAllContractOverview(),
      selContractAddr: contract.getContractAddressList()[0],
    };
  }

  async componentWillMount() {
    const eventLogs = await ContractDC.getEventLogs(this.state.selContractAddr);
    const functionLogs = await ContractDC.getFunctionLogs(this.state.selContractAddr);
    this.setState({ ...this.state, eventLogs, functionLogs });
  }

  private async _onSelectOption(selContractAddr: string): Promise<void> {
    if (this.state.selContractAddr === selContractAddr) return;

    const eventLogs = await ContractDC.getEventLogs(selContractAddr);
    const functionLogs = await ContractDC.getFunctionLogs(selContractAddr);
    this.setState({ ...this.state, eventLogs, functionLogs, selContractAddr });
  }

  private _onClickTab(tab: string): void {
    this.setState({ ...this.state, currentTab: tab });
  }

  render() {
    return (
      <Container>
        <ContractTopView
          contractOverviews={this.state.contractOverviews}
          selContractAddr={this.state.selContractAddr}
          onSelectOption={this._onSelectOption.bind(this)}
        />
        <RayonTab
          className={styles.logTab}
          tabs={this._tabs}
          selectedTab={this.state.currentTab}
          onClickTab={this._onClickTab.bind(this)}
        >
          <ContractTabLogView
            functionLogs={this.state.functionLogs}
            eventLogs={this.state.eventLogs}
            currentTab={this.state.currentTab}
          />
        </RayonTab>
      </Container>
    );
  }
}

export default ContractVC;
