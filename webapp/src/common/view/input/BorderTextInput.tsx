import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './BorderTextInput.scss';

interface BorderTextInputProps {
  title?: string;
  className?: string;
  onChangeTextInput: (event) => void;
  value: string | number;
  disabled?: boolean;
}

class BorderTextInput extends Component<BorderTextInputProps, {}> {
  render() {
    return (
      <div
        className={classNames(styles.borderTextInput, this.props.className)}
      >
        <label className={styles.title}>{this.props.title}</label>
        <input disabled={this.props.disabled} onChange={this.props.onChangeTextInput} type={'text'} value={this.props.value}/>
      </div>
    );
  }
}

export default BorderTextInput;
