import React, { Component } from 'react';

// model
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
import TxLog, { EventLog, FunctionLog } from '../../../../shared/common/model/TxLog';
import Metamask from 'common/model/metamask/Metamask';

// dc
import ContractDC from 'contract/dc/ContractDC';

// view
import Container from 'common/view/container/Container';
import OnlyAdminView from 'common/view/view/OnlyAdminView';
import NoMetamaskView from 'common/view/view/NoMetamaskView';

// util
import StringUtil from '../../../../shared/common/util/StringUtil';

// styles
import styles from './ContractVC.scss';

interface ContractVCState {
  userAccount: string;
  methodLogs: FunctionLog[];
  eventLogs: EventLog[];
}

class ContractVC extends Component<{}, ContractVCState> {
  constructor(props) {
    super(props);
    this.state = {
      userAccount: undefined,
      methodLogs: new Array<FunctionLog>(),
      eventLogs: new Array<EventLog>(),
    };
  }

  async componentDidMount() {
    // const eventLogs = await ContractDC.fetchEventLogs();
    // const methodLogs = await ContractDC.fetchMethodLogs();

    const eventLogs = [];
    const methodLogs = [];

    let userAccount = await ContractDC.getUserAccount();
    if (!StringUtil.isEmpty(this.state.userAccount) && this.isAdminUser()) {
      ContractDC.setWeb3();
      userAccount = await ContractDC.getUserAccount();
    } else {
      ContractDC.setMetamaskLoginListener(this.onMetamaskLogin.bind(this));
    }

    console.log(methodLogs);
    console.log(eventLogs);

    this.setState({ ...this.state, userAccount, eventLogs, methodLogs });
  }

  onMetamaskLogin(loginResult: Metamask) {
    this.setState({ ...this.state, userAccount: loginResult.selectedAddress });
  }

  isAdminUser() {
    return this.state.userAccount.toLowerCase() === ContractConfigure.ADDR_CONTRACT_ADMIN.toLowerCase();
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
        <div>this is contract admin page</div>
      </Container>
    );
  }

  render() {
    if (StringUtil.isEmpty(this.state.userAccount)) return this.renderNoUser();
    else if (!this.isAdminUser()) return this.renderAdminOnly();
    else return this.renderContractAdmin();
  }
}

export default ContractVC;
