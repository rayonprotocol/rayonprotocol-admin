import React, { Component } from 'react';

// styles
import styles from './TransferTokenView.scss';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import BorderTextInput from 'common/view/input/BorderTextInput';
import RayonButton from 'common/view/button/RayonButton';

interface TokenMintViewState {
  toAddress: string;
  amount: number;
}

class TransferTokenView extends Component<{}, TokenMintViewState> {
  onClickSendButton() {
    console.log('Click');
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
      <DashboardContainer className={styles.totalTokenView} title={'Transfer Token'}>
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
          className={styles.sendBtn}
          title={'Send'}
          onClickButton={this.onClickSendButton.bind(this)}
          isBorrower={true}
        />
      </DashboardContainer>
    );
  }
}

export default TransferTokenView;
