import React, { Component } from 'react';

// model
import { Mint } from 'token/model/Token';

// dc
import ContractDC from 'common/dc/ContractDC';
import TokenDC from 'token/dc/TokenDC';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import RayonButton from 'common/view/button/RayonButton';

// util
import MakeFormatedNumber from 'common/util/MakeFormatedNumber';

// styles
import styles from './TotalTokenView.scss';

interface TotalTokenViewProps {
  className?: string;
}

interface TotalTokenViewState {
  totalBalance: number;
  mintEventList: Mint[];
}

class TotalTokenView extends Component<TotalTokenViewProps, TotalTokenViewState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      totalBalance: 0,
      mintEventList: [],
    };
  }

  async componentWillMount() {
    const totalBalance = await TokenDC.getTotalBalance();
    TokenDC.setWatchMintEventListener(this.getMintEvent.bind(this));
    TokenDC.watchMintEvent();
    this.setState({ ...this.state, totalBalance });
  }

  componentWillUnmount() {
    TokenDC.stopWatchMintEvent();
  }

  getMintEvent(erorr, event) {
    const { mintEventList } = this.state;
    mintEventList.push(event['args']);
    this.setState({ ...this.state, mintEventList });
  }

  onClickDetailButton() {
    TokenDC.mint(ContractDC.ADMIN_ADDRESS, 100000);
  }

  render() {
    const { totalBalance, mintEventList } = this.state;
    console.log('mintEventList', mintEventList);
    let latestMintEventList: Mint[] = mintEventList.length >= 2 ? mintEventList.slice(-2) : mintEventList;
    return (
      <DashboardContainer className={styles.totalTokenView} title={'Total Token'}>
        <div className={styles.totalTokenSection}>
          <p className={styles.subTitle}>Balance</p>
          <p className={styles.totalToken}>{MakeFormatedNumber(totalBalance)} RYN</p>
        </div>

        <div className={styles.extraMintedTokenSection}>
          <p className={styles.subTitle}>Extra Minted Token</p>
          {latestMintEventList.reverse().map((item, index) => {
            return (
              <p key={index} className={styles.extraMintedToken}>
                {MakeFormatedNumber(item.amount)} RYN
              </p>
            );
          })}
        </div>

        <RayonButton
          className={styles.detailBtn}
          title={'Detail'}
          onClickButton={this.onClickDetailButton.bind(this)}
        />
      </DashboardContainer>
    );
  }
}

export default TotalTokenView;
