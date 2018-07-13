import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './BorderTextInput.scss';

interface BorderTextInputProps {
  title?: string;
  className?: string;
}

class BorderTextInput extends Component<BorderTextInputProps, {}> {
  render() {
    return (
      <div className={classNames(styles.borderTextInput, this.props.className)}>
        <div className={styles.title}>{this.props.title}</div>
        <input type="text" />
      </div>
    );
  }
}

export default BorderTextInput;
