import React, { Component } from 'react';

// model
import { EventLog, FunctionLog } from '../../../../shared/common/model/TxLog';

// dc
import ContractDC from 'contract/dc/ContractDC';
import UserDC from 'user/dc/UserDC';

// view
import Container from 'common/view/container/Container';
import OnlyAdminView from 'common/view/view/OnlyAdminView';
import NoMetamaskView from 'common/view/view/NoMetamaskView';

// util
import StringUtil from '../../../../shared/common/util/StringUtil';

interface ContractVCState {
  userAccount: string;
  methodLogs: FunctionLog[];
  eventLogs: EventLog[];
}

class ContractVC extends Component<{}, ContractVCState> {
  constructor(props) {
    super(props);
    this.state = {
      userAccount: UserDC.getUserAcount(),
      methodLogs: new Array<FunctionLog>(),
      eventLogs: new Array<EventLog>(),
    };
  }

  async componentWillMount() {
    UserDC.addUserLoginStatusChangeListeners(this.onUserLoginStatusChange.bind(this));
    const eventLogs = await ContractDC.getEventLogs();
    const methodLogs = await ContractDC.getMethodLogs();

    console.log('asdfasdf');
    console.log(eventLogs, methodLogs);

    this.setState({ ...this.state, eventLogs, methodLogs });
  }

  onUserLoginStatusChange(userAccount: string) {
    this.setState({ ...this.state, userAccount });
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
    else if (!UserDC.isAdminUser(this.state.userAccount)) return this.renderAdminOnly();
    else return this.renderContractAdmin();
  }
}

export default ContractVC;
