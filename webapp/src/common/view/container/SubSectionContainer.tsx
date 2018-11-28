import React, { StatelessComponent } from 'react';

// styles
import styles from './SubSectionContainer.scss';

interface SubSectionContainerProps {
  title: string;
}

const SubSectionContainer: StatelessComponent<SubSectionContainerProps> = props => {
  return (
    <section className={styles.subSectionContainer}>
      <h3>{props.title}</h3>
      {props.children}
    </section>
  );
};

export default SubSectionContainer;
