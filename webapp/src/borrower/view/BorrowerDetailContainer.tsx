import React, { StatelessComponent, Fragment } from 'react';

// styles
import styles from './BorrowerDetailContainer.scss';
import SectionTitle from 'common/view/section/SectionTitle';

interface BorrowerDetailContainerProps {
  title: string;
  buttonElement?: JSX.Element;
}
const BorrowerDetailContainer: StatelessComponent<BorrowerDetailContainerProps> = props => {
  return (
    <main className={styles.borrowerDetailContainer}>
      <SectionTitle className={styles.sectionTitle} title={
        <div className={styles.titleWrap}>
          <h2>{props.title}</h2>
          {props.buttonElement}
        </div>
      } />
      {props.children}
    </main>
  );
};

export default BorrowerDetailContainer;