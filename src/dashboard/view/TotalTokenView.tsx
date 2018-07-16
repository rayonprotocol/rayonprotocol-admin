import React, { Component } from 'react';

// dc
import ContractDC from 'common/dc/ContractDC';
import TokenDC from 'token/dc/TokenDC';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import RayonButton from 'common/view/button/RayonButton';

// styles
import styles from './TotalTokenView.scss';

interface TotalTokenViewProps {
  className?: string;
}

interface TotalTokenViewState {
  totalBalance: number;
}

class TotalTokenView extends Component<TotalTokenViewProps, TotalTokenViewState> {
  async componentWillMount() {
    const totalBalance = await TokenDC.getTotalBalance();
    console.log('totalBalance', totalBalance);
    this.setState({ ...this.state, totalBalance });
  }

  onClickDetailButton() {
    TokenDC.mint(ContractDC.ADMIN_ADDRESS, 100000);
  }
  
  render() {
    return (
      <DashboardContainer className={styles.totalTokenView} title={'Total Token'}>
        <div className={styles.totalTokenSection}>
          <p className={styles.subTitle}>Balance</p>
          <p className={styles.totalToken}>20,000,000 RYN</p>
        </div>
        <div className={styles.extraMintedTokenSection}>
          <p className={styles.subTitle}>Extra Minted Token</p>
          <p className={styles.extraMintedToken}>1,000 RYN</p>
          <p className={styles.extraMintedToken}>1,000 RYN</p>
        </div>
        <RayonButton
          className={styles.detailBtn}
          title={'Detail'}
          onClickButton={this.onClickDetailButton.bind(this)}
          isBorrower={true}
        />
      </DashboardContainer>
    );
  }
}

export default TotalTokenView;
