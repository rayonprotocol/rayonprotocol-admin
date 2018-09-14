import React, { Component } from 'react';
// import Blockies from 'react-blockies-image';
import classNames from 'classnames';

// styles
import styles from './TopHolderCard.scss';

interface TopHolderCardProps {
  className?: string;
  rank: number;
  userAddress: string;
  onClickDetailHistory: (userAddress) => void;
}

class TopHolderCard extends Component<TopHolderCardProps, {}> {
  trimAddress(addr: string) {
    return addr.slice(0, 5) + '...' + addr.slice(-5);
  }

  render() {
    return (
      <div className={classNames(this.props.className, styles.topHolderCard)}>
        <div className={styles.rank}>{`# ${this.props.rank}`}</div>
        <div className={styles.identicon}>
          {/* <Blockies className={styles.blockies} seed={this.props.userAddress} /> */}
        </div>
        <div className={styles.userAddress}>{this.trimAddress(this.props.userAddress)}</div>
        <button onClick={() => this.props.onClickDetailHistory(this.props.userAddress)}>Detail</button>
      </div>
    );
  }
}

export default TopHolderCard;
