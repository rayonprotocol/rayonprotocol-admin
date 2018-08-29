import React, { Component } from 'react';

// model
import { RayonEvent, MintEvent } from '../../../../shared/token/model/Token';

// dc
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
  mintEventList: MintEvent[];
  totalBalance: number;
}

class TotalTokenView extends Component<TotalTokenViewProps, TotalTokenViewState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      mintEventList: new Array(),
      totalBalance: 0,
    };
    this.onMintEvent = this.onMintEvent.bind(this);
  }

  componentWillMount(): void {
    TokenDC.addEventListener(RayonEvent.Mint, this.onMintEvent);
  }

  componentWillUnmount(): void {
    TokenDC.removeEventListener(RayonEvent.Mint, this.onMintEvent);
  }

  async onMintEvent(event: MintEvent[]): Promise<void> {
    const totalBalance = await TokenDC.fetchTokenTotalBalance();
    this.setState({ ...this.state, mintEventList: event, totalBalance });
  }

  onClickDetailButton(): void {
    console.log('click');
  }

  render() {
    const { mintEventList, totalBalance } = this.state;
    let latestMintEventList: MintEvent[] = mintEventList.length >= 2 ? mintEventList.slice(-2) : mintEventList;
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
