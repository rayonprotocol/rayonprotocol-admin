import React, { Component } from 'react';

// model
import { EventLog, FunctionLog } from '../../../../shared/common/model/TxLog';
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

// dc
import ContractDC from 'contract/dc/ContractDC';
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/container/Container';
import OnlyAdminView from 'common/view/view/OnlyAdminView';
import NoMetamaskView from 'common/view/view/NoMetamaskView';
import ContractTopView from 'contract/view/ContractTopView';
import ContractFunctionLogView from 'contract/view/ContractFunctionLogView';
import ContractEventLogView from 'contract/view/ContractEventLogView';
import RayonTab from 'common/view/tab/RayonTab';

// util
import StringUtil from '../../../../shared/common/util/StringUtil';

import styles from './ContractVC.scss';

interface ContractVCState {
  userAccount: string;
  functionLogs: FunctionLog[];
  eventLogs: EventLog[];
  currentContractAddress: string;
  currentTab: string;
}

class ContractVC extends Component<{}, ContractVCState> {
  public TAB_FUNCTION = 'Function';
  public TAB_EVENT = 'Event';

  private _tabs = [this.TAB_FUNCTION, this.TAB_EVENT];

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      userAccount: UserDC.getUserAcount(),
      functionLogs: new Array<FunctionLog>(),
      eventLogs: new Array<EventLog>(),
      currentTab: this.TAB_FUNCTION,
      currentContractAddress: ContractConfigure.ADDR_RAYONTOKEN,
    };
  }

  async componentWillMount() {
    UserDC.addUserLoginStatusChangeListeners(this.onUserLoginStatusChange.bind(this));
    const eventLogs = await ContractDC.getEventLogs();
    const functionLogs = await ContractDC.getFunctionLogs();

    this.setState({ ...this.state, eventLogs, functionLogs });
  }

  onUserLoginStatusChange(userAccount: string) {
    this.setState({ ...this.state, userAccount });
  }

  onClickTab(tab: string) {
    this.setState({ ...this.state, currentTab: tab });
  }

  onSelectOption(selectedContractAddress: string) {
    console.log('selectedContractAddress', selectedContractAddress);
    this.setState({ ...this.state, currentContractAddress: selectedContractAddress });
  }

  renderNoUser() {
    return (
      <Container>
        <NoMetamaskView />
      </Container>
    );
  }

  renderAdminOnly() {
    return (
      <Container>
        <OnlyAdminView />
      </Container>
    );
  }

  renderContractAdmin() {
    return (
      <Container>
        <ContractTopView
          currentContractAddress={this.state.currentContractAddress}
          onSelectOption={this.onSelectOption.bind(this)}
        />
        <RayonTab
          className={styles.logTab}
          tabs={this._tabs}
          selectedTab={this.state.currentTab}
          onClickTab={this.onClickTab.bind(this)}
        >
          {this.renderLogTabView()}
        </RayonTab>
      </Container>
    );
  }

  renderLogTabView() {
    switch (this.state.currentTab) {
      case this.TAB_EVENT:
        return <ContractEventLogView eventLogs={this.state.eventLogs} />;
      case this.TAB_FUNCTION:
        return <ContractFunctionLogView functionLogs={this.state.functionLogs} />;
      default:
        return <ContractFunctionLogView functionLogs={this.state.functionLogs} />;
    }
  }

  render() {
    if (StringUtil.isEmpty(this.state.userAccount)) return this.renderNoUser();
    else if (!UserDC.isAdminUser(this.state.userAccount)) return this.renderAdminOnly();
    else return this.renderContractAdmin();
  }
}

export default ContractVC;
