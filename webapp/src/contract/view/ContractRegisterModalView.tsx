import React, { Component } from 'react';

// view
import RayonButton from 'common/view/button/RayonButton';
import RayonModal from 'common/view/modal/RayonModalView';

interface ContractRegisterModalViewProps {
  isModalOpen: boolean;
  onRequestClose: () => void;
  onClickRegister: (proxyAddress: string, blockNumber: number) => void;
}

interface ContractRegisterModalViewState {
  proxyAddress: string;
  blockNumber: number;
}

class ContractRegisterModalView extends Component<ContractRegisterModalViewProps, ContractRegisterModalViewState> {
  handleClickRegisterBtn() {
    this.props.onClickRegister(this.state.proxyAddress, this.state.blockNumber);
  }

  onChangeProxyAddress(proxyAddress: string) {
    this.setState({ ...this.state, proxyAddress });
  }
  onChangeBlockNumber(blockNumber: number) {
    this.setState({ ...this.state, blockNumber });
  }

  render() {
    return (
      <RayonModal isModalOpen={this.props.isModalOpen} onRequestClose={this.props.onRequestClose}>
        <input onChange={this.onChangeProxyAddress.bind(this)} type={'text'} />
        <input onChange={this.onChangeBlockNumber.bind(this)} type={'number'} />
        <RayonButton title={'Register'} onClickButton={this.handleClickRegisterBtn.bind(this)} />
      </RayonModal>
    );
  }
}

export default ContractRegisterModalView;
