import React, { Component } from 'react';

// model
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

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
    return <div>User must hava Metamask</div>;
  }

  renderAdminOnly() {
    return <div>This page can use only admin</div>;
  }

  renderContractAdmin() {
    return <div>this is contract admin page</div>;
  }

  render() {
    if (this.state.userAccount === null) return this.renderNoUser();
    else if (this.state.userAccount === ContractConfigure.ADDR_CONTRACT_ADMIN) return this.renderAdminOnly();
    else return this.renderContractAdmin();
  }
}

export default ContractVC;
