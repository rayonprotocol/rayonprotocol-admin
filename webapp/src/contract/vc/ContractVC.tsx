import React, { Component } from 'react';

// model
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

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
}

class ContractVC extends Component<{}, ContractVCState> {
  constructor(props) {
    super(props);
    this.state = {
      userAccount: undefined,
    };
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
    console.log(this.state.userAccount);
    if (StringUtil.isEmpty(this.state.userAccount)) return this.renderNoUser();
    else if (this.state.userAccount !== ContractConfigure.ADDR_CONTRACT_ADMIN) return this.renderAdminOnly();
    else return this.renderContractAdmin();
  }
}

export default ContractVC;
