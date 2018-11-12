
import React, { StatelessComponent } from 'react';
import classNames from 'classnames';

import styles from './TextButtons.scss';

interface StyleVariation {
  bordered?: boolean;
  filled?: boolean;
}

interface TextButtonProps extends StyleVariation, React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> { }

const TextButton: StatelessComponent<TextButtonProps> = props => {
  const {
    children, className, bordered, filled,
    ...otherProps
  } = props;
  const mergedClassName = classNames(styles.textButton, {
    [styles.bordered]: bordered,
    [styles.filled]: filled,
  }, className);

  return (
    <button className={mergedClassName} {...otherProps}>{children}</button>
  );
}

interface TextSubmitButtonProps extends StyleVariation, React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement> { }

const TextSubmitButton: StatelessComponent<TextSubmitButtonProps> = props => {
  const {
    className, bordered, filled,
    type, ...otherProps
  } = props;
  const mergedClassName = classNames(styles.textButton, {
    [styles.bordered]: bordered,
    [styles.filled]: filled,
  }, className);

  return (
    <input type='submit' className={mergedClassName} {...otherProps} />
  );
}

export { TextButton, TextSubmitButton };