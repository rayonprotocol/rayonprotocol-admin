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
  amount: number;
}

class TokenMintView extends Component<{}, TokenMintViewState> {
  validMintInputData() {
    const { toAddress, amount } = this.state;
    return toAddress !== undefined && toAddress !== null && amount !== undefined && amount !== null && amount !== 0;
  }
  onClickMintButton() {
    const { toAddress, amount } = this.state;
    if (!this.validMintInputData) alert('mint input error!');
    TokenDC.mint(toAddress, amount);
  }

  onChangeToAddress(event) {
    const toAddress = event.target.value;
    this.setState({ ...this.state, toAddress });
  }

  onChangeAmount(event) {
    const amount = event.target.value;
    this.setState({ ...this.state, amount });
  }

  render() {
    return (
      <DashboardContainer className={styles.tokenMintView} title={'Mint'}>
        <BorderTextInput
          className={styles.textInput}
          title={'To'}
          onChangeTextInput={this.onChangeToAddress.bind(this)}
        />
        <BorderTextInput
          className={styles.textInput}
          title={'Amount'}
          onChangeTextInput={this.onChangeAmount.bind(this)}
        />
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
