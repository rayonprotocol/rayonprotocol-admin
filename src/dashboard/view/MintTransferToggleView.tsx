import React, { Component } from 'react';

// dc
import TokenDC from 'token/dc/TokenDC';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import BorderTextInput from 'common/view/input/BorderTextInput';
import RayonButton from 'common/view/button/RayonButton';
import RayonToggleButton from 'common/view/button/RayonToggleButton';

// styles
import styles from './MintTransferToggleView.scss';

interface MintTransferToggleViewState {
  toAddress: string;
  amount: number;
  isMintMode: boolean;
}

class MintTransferToggleView extends Component<{}, MintTransferToggleViewState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isMintMode: true,
    };
  }
  validMintInputData() {
    const { toAddress, amount } = this.state;
    return toAddress !== undefined && toAddress !== null && amount !== undefined && amount !== null && amount !== 0;
  }
  onClickSendButton() {
    const { toAddress, amount } = this.state;
    if (!this.validMintInputData) alert('mint input error!');
    TokenDC.transfer(toAddress, amount);
  }

  onChangeToAddress(event) {
    const toAddress = event.target.value;
    this.setState({ ...this.state, toAddress });
  }

  onChangeAmount(event) {
    const amount = event.target.value;
    this.setState({ ...this.state, amount });
  }

  onClickToggleButton(event) {
    this.setState({ ...this.state, isMintMode: !this.state.isMintMode });
  }

  render() {
    const { isMintMode } = this.state;
    return (
      <DashboardContainer className={styles.mintTransferToggleView} title={'Mint & Transfer'}>
        <RayonToggleButton
          className={styles.toggleBtn}
          toggleItem={['Mint', 'Transfer']}
          isLeftActivated={isMintMode}
          onClick={this.onClickToggleButton.bind(this)}
        />
        <BorderTextInput
          className={styles.textInput}
          title={'To'}
          onChangeTextInput={this.onChangeToAddress.bind(this)}
          isLender={!isMintMode}
        />
        <BorderTextInput
          className={styles.textInput}
          title={'Amount'}
          onChangeTextInput={this.onChangeAmount.bind(this)}
          isLender={!isMintMode}
        />
        <RayonButton
          className={styles.sendBtn}
          title={'Send'}
          onClickButton={this.onClickSendButton.bind(this)}
          isLender={!isMintMode}
        />
      </DashboardContainer>
    );
  }
}

export default MintTransferToggleView;
