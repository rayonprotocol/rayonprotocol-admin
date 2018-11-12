import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './SectionTitle.scss';

interface SectionTitleProps {
  className?: string;
  title: string | JSX.Element;
}

class SectionTitle extends Component<SectionTitleProps, {}> {
  render() {
    return (
      <div className={classNames(styles.titleSection, this.props.className)}>
        <div className={styles.title}>{this.props.title}</div>
        {this.props.children}
      </div>
    );
  }
}

export default SectionTitle;
