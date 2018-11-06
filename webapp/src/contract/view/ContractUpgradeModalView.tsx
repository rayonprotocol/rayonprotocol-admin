import React, { Component } from 'react';

// view
import RayonButton from 'common/view/button/RayonButton';
import RayonModal from 'common/view/modal/RayonModalView';

interface ContractUpgradeModalViewProps {
  isModalOpen: boolean;
  onRequestClose: () => void;
  onClickUpgrade: (interfaceAddress: string) => void;
}

interface ContractUpgradeModalViewState {
  interfaceAddress: string;
}

class ContractUpgradeModalView extends Component<ContractUpgradeModalViewProps, ContractUpgradeModalViewState> {
  handleClickUpgradeBtn() {
    this.props.onClickUpgrade(this.state.interfaceAddress);
  }

  onChangeInterfaceAddress(interfaceAddress: string) {
    this.setState({ ...this.state, interfaceAddress });
  }

  render() {
    return (
      <RayonModal isModalOpen={this.props.isModalOpen} onRequestClose={this.props.onRequestClose}>
        <input onChange={this.onChangeInterfaceAddress.bind(this)} type={'text'} />
        <RayonButton title={'Upgrade'} onClickButton={this.handleClickUpgradeBtn.bind(this)} />
      </RayonModal>
    );
  }
}

export default ContractUpgradeModalView;
