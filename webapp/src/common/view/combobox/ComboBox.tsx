import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './ComboBox.scss';

interface ComboBoxProps {
  className?: string;
  label: string;
  options: string[];
  onSelectOption: (option: string) => void;
}

class ComboBox extends Component<ComboBoxProps, {}> {
  render() {
    return (
      <div className={classNames(styles.contractCombobox, this.props.className)}>
        <div className={styles.combobox}>
          <span className={styles.comboboxLabel}>{this.props.label}</span>
          <select onChange={event => this.props.onSelectOption(event.target.value)}>
            {this.props.options.map((option, index) => {
              return (
                <option key={index} value={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }
}

export default ComboBox;
