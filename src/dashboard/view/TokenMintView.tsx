import React, { Component } from 'react';

// dc
import TokenDC from 'token/dc/TokenDC';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import BorderTextInput from 'common/view/input/BorderTextInput';
import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './TokenMintView.scss';

interface TokenMintViewState {
  toAddress: string;
  balance: number;
}

class TokenMintView extends Component<{}, TokenMintViewState> {
  validMintInputData() {
    const { toAddress, balance } = this.state;
    return toAddress !== undefined && toAddress !== null && balance !== undefined && balance !== null && balance !== 0;
  }
  onClickMintButton() {
    const { toAddress, balance } = this.state;
    if (!this.validMintInputData) alert('mint input error!');
    TokenDC.mint(toAddress, balance);
  }

  onChangeToAddress(event) {
    const toAddress = event.target.value;
    this.setState({ ...this.state, toAddress });
  }

  onChangeBalance(event) {
    const balance = event.target.value;
    this.setState({ ...this.state, balance });
  }

  render() {
    return (
      <DashboardContainer className={styles.tokenMintView} title={'Mint'}>
        <BorderTextInput className={styles.textInput} title={'To'} onChangeTextInput={this.onChangeToAddress} />
        <BorderTextInput className={styles.textInput} title={'Balance'} onChangeTextInput={this.onChangeBalance} />
        <RayonButton
          className={styles.mintButton}
          title={'Mint'}
          onClickButton={this.onClickMintButton.bind(this)}
          isBorrower={true}
        />
      </DashboardContainer>
    );
  }
}

export default TokenMintView;
