import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './RayonToggleButton.scss';

interface RayonToggleButtonProps {
  toggleItem: string[];
  className?: string;
  isLeftActivated: boolean;
  onClick: (event) => void;
}

class RayonToggleButton extends Component<RayonToggleButtonProps, {}> {
  render() {
    const { toggleItem, isLeftActivated } = this.props;
    return (
      <div
        className={classNames(styles.rayonToggleButton, this.props.className, {
          [styles.activatedLeft]: isLeftActivated,
        })}
        onClick={this.props.onClick}
      >
        <span className={styles.toggleLeft}>{toggleItem[0]}</span>
        <span className={styles.toggleRight}>{toggleItem[1]}</span>
      </div>
    );
  }
}

export default RayonToggleButton;
