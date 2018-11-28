import React, { StatelessComponent } from 'react';
import classNames from 'classnames';

// styles
import styles from './BorderTextSelect.scss';

interface BorderTextSelectProps {
  title?: string;
  className?: string;
  onChangeTextOption: (event) => void;
  value?: string | number;
  disabled?: boolean;
}

const BorderTextSelect: StatelessComponent<BorderTextSelectProps> = props => {
  return (
    <div
      className={classNames(styles.borderTextInput, props.className)}
    >
      <label className={styles.title}>{props.title}</label>
      <select value={props.value} disabled={props.disabled} onChange={props.onChangeTextOption}>
        {props.children}
      </select>
    </div>
  )
};

export default BorderTextSelect;
