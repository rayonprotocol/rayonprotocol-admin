import React, { Component } from 'react';

// model
import { Mint } from 'token/model/Token';

// dc
import TokenDC from 'token/dc/TokenDC';
import MintEventDC from 'event/dc/MintEventDC';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';
import RayonButton from 'common/view/button/RayonButton';

// util
import MakeFormatedNumber from 'common/util/MakeFormatedNumber';

// styles
import styles from './TotalTokenView.scss';
import { MintEvent } from '../../../../shared/event/model/RayonEvent';

interface TotalTokenViewProps {
  className?: string;
}

interface TotalTokenViewState {
  mintEventList: Mint[];
}

class TotalTokenView extends Component<TotalTokenViewProps, TotalTokenViewState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      mintEventList: [],
    };
  }

  async componentWillMount() {
    MintEventDC.subscribeEvent(TotalTokenView.name, this.getMintEvent.bind(this));
  }

  componentWillUnmount() {
    MintEventDC.unsubscribeEvent(TotalTokenView.name);
  }

  getMintEvent(event: MintEvent[]) {
    this.setState({ ...this.state, mintEventList: event });
  }

  onClickDetailButton() {
    console.log('click');
    MintEventDC.fetchMintEvents();
  }

  render() {
    const { mintEventList } = this.state;
    let latestMintEventList: Mint[] = mintEventList.length >= 2 ? mintEventList.slice(-2) : mintEventList;
    return (
      <DashboardContainer className={styles.totalTokenView} title={'Total Token'}>
        <div className={styles.totalTokenSection}>
          <p className={styles.subTitle}>Balance</p>
          <p className={styles.totalToken}>{MakeFormatedNumber(TokenDC.getTotalBalance())} RYN</p>
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
