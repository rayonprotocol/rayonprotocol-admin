import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './Container.scss';

interface ContainerProps {
  className?: string;
  noTopPadding?: boolean;
  noHorizontalPadding?: boolean;
}

class Container extends Component<ContainerProps, {}> {
  render() {
    return (
      <div
        className={classNames(styles.container, this.props.className, {
          [styles.noTopPadding]: this.props.noTopPadding,
          [styles.noHorizontalPadding]: this.props.noHorizontalPadding,
        })}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Container;
