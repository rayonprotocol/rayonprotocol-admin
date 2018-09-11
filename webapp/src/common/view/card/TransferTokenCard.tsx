import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './TransferTokenCard.scss';

interface TransferTokenCardProps {
  selUserAccount: string;
  from: string;
  to: string;
  amount: number;
  balance: number;
}

class TransferTokenCard extends Component<TransferTokenCardProps, {}> {
  trimAddress(addr: string) {
    return addr.slice(0, 5) + '...' + addr.slice(-5);
  }

  renderStatusTag(isUserSender: boolean) {
    return (
      <div className={classNames(styles.tag, { [styles.sendTag]: isUserSender })}>
        <p>{isUserSender ? 'Send' : 'Recieve'}</p>
      </div>
    );
  }

  render() {
    const isUserSender = this.props.selUserAccount === this.props.from;
    return (
      <div className={styles.transferTokenCard}>
        <div className={styles.status}>
          {this.renderStatusTag(isUserSender)}
          <div className={styles.address}>
            <div className={styles.from}>
              <span>From</span>
              <span>{this.trimAddress(this.props.from)}</span>
            </div>
            <div className={styles.to}>
              <span>To</span>
              <span>{this.trimAddress(this.props.to)}</span>
            </div>
          </div>
        </div>
        <div className={styles.value}>
          <div className={classNames(styles.amount, { [styles.recieve]: !isUserSender })}>
            <span>{isUserSender ? `- ${this.props.amount}` : `+ ${this.props.amount}`}</span>
            <span>RYN</span>
          </div>
          <div className={styles.balance}>
            <span>{this.props.balance}</span>
            <span>RYN</span>
          </div>
        </div>
      </div>
    );
  }
}

export default TransferTokenCard;
