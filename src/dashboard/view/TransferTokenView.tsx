import React, { Component } from 'react';

// styles
import styles from './TransferTokenView.scss';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import BorderTextInput from 'common/view/input/BorderTextInput';
import RayonButton from 'common/view/button/RayonButton';

class TransferTokenView extends Component<{}, {}> {
  onClickSendButton() {
    console.log('Click');
  }
  render() {
    return (
      <DashboardContainer className={styles.totalTokenView} title={'Transfer Token'}>
        <BorderTextInput className={styles.textInput} title={'To'} />
        <BorderTextInput className={styles.textInput} title={'Balance'} />
        <RayonButton className={styles.sendBtn} title={'Send'} onClickButton={this.onClickSendButton.bind(this)} isBorrower={true} />
      </DashboardContainer>
    );
  }
}

export default TransferTokenView;
