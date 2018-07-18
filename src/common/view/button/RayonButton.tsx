import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './RayonButton.scss';

interface RayonButtonProps {
  title: string;
  className?: string;
  isLender?: boolean;
  onClickButton: () => void;
}

class RayonButton extends Component<RayonButtonProps, {}> {
  render() {
    return (
      <div
        onClick={this.props.onClickButton}
        className={classNames(styles.commonRayonButton, this.props.className, {
          [styles.lender]: this.props.isLender,
        })}
      >
        {this.props.title}
      </div>
    );
  }
}

export default RayonButton;
