import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './ProgressBar.scss';

interface ProgressBarProps {
  className?: string;
  percent: number;
  tipText?: string;
}

class ProgressBar extends Component<ProgressBarProps, {}> {
  calcTipPosition(): string {
    if (this.props.percent > 94) return `94%`;
    else if (this.props.percent < 1) return `-1%`;
    return `${this.props.percent - 2}%`;
  }

  renderTip() {
    return (
      <div className={styles.tip} style={{ left: this.calcTipPosition() }}>
        <p>{this.props.tipText}</p>
      </div>
    );
  }

  render() {
    return (
      <div
        className={classNames(this.props.className, styles.outerProgress)}
        style={{ marginTop: this.props.tipText && '10px' }}
      >
        {this.props.tipText && this.renderTip()}
        <div className={styles.innerProgress} style={{ width: `${this.props.percent}%` }} />
      </div>
    );
  }
}

export default ProgressBar;
