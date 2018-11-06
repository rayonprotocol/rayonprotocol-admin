import React, { Component, Fragment } from 'react';

// model
import { newContract } from '../../../../shared/contract/model/Contract';

// view
import SectionTitle from 'common/view/section/SectionTitle';

interface ContractInfoViewProps {
  contracts: newContract[];
  onClickRegisterModalOpen: () => void;
  onClickUpgradeModalOpen: () => void;
}

class ContractInfoView extends Component<ContractInfoViewProps, {}> {
  render() {
    return (
      <Fragment>
        <SectionTitle title={'Contract'}>
          <div>
            <div onClick={this.props.onClickRegisterModalOpen}>Register</div>
            <div onClick={this.props.onClickUpgradeModalOpen}>Upgrade</div>
          </div>
        </SectionTitle>
        <div>table</div>
      </Fragment>
    );
  }
}

export default ContractInfoView;
