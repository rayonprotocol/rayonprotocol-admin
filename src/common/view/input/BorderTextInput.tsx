import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './BorderTextInput.scss';

interface BorderTextInputProps {
  title?: string;
  className?: string;
  isLender?: boolean;
  onChangeTextInput: (event) => void;
}

class BorderTextInput extends Component<BorderTextInputProps, {}> {
  render() {
    return (
      <div
        className={classNames(styles.borderTextInput, this.props.className, { [styles.lender]: this.props.isLender })}
      >
        <div className={styles.title}>{this.props.title}</div>
        <input onChange={this.props.onChangeTextInput} type={'text'} />
      </div>
    );
  }
}

export default BorderTextInput;
