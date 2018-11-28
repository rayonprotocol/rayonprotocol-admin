
import React, { StatelessComponent } from 'react';
import classNames from 'classnames';

import styles from './TextButtons.scss';

interface StyleVariation {
  bordered?: boolean;
  danger?: boolean;
  filled?: boolean;
}

interface TextButtonProps extends StyleVariation, React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> { }

const mergeClassNames = (props: TextButtonProps) => classNames(styles.textButton, {
  [styles.bordered]: props.bordered,
  [styles.filled]: props.filled,
  [styles.danger]: props.danger,
}, props.className);

const TextButton: StatelessComponent<TextButtonProps> = props => {
  const {
    children, className, bordered, filled, danger,
    ...otherProps
  } = props;

  return (
    <button className={mergeClassNames({className, bordered, filled, danger})} {...otherProps}>{children}</button>
  );
}

interface TextSubmitButtonProps extends StyleVariation, React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement> { }

const TextSubmitButton: StatelessComponent<TextSubmitButtonProps> = props => {
  const {
    className, bordered, filled, danger,
    type, ...otherProps
  } = props;

  return (
    <input type='submit' className={mergeClassNames({className, bordered, filled, danger})} {...otherProps} />
  );
}

export { TextButton, TextSubmitButton };