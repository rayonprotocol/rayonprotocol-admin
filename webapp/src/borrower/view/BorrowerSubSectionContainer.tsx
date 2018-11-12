import React, { StatelessComponent } from 'react';

// styles
import styles from './BorrowerSubSectionContainer.scss';

interface BorrowerSubSectionContainerProps {
  title: string;
}

const BorrowerSubSectionContainer: StatelessComponent<BorrowerSubSectionContainerProps> = props => {
  return (
    <section className={styles.borrowerSubSectionContainer}>
      <h3>{props.title}</h3>
      {props.children}
    </section>
  );
};

export default BorrowerSubSectionContainer
