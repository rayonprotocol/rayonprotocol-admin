import React, { StatelessComponent } from 'react';
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

const BorderTextInput: StatelessComponent<BorderTextInputProps> = props => (
  <div
    className={classNames(styles.borderTextInput, props.className)}
  >
    <label className={styles.title}>{props.title}</label>
    <input disabled={props.disabled} onChange={props.onChangeTextInput} type={'text'} value={props.value} />
  </div>
);

export default BorderTextInput;
