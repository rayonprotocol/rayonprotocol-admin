import React, { StatelessComponent } from 'react';
import Container from 'common/view/container/Container';

// styles
import styles from './BorrowerContainer.scss';


const BorrowerContainer: StatelessComponent<{}> = props => {
  return <Container className={styles.borrowerContainer} noTopPadding noHorizontalPadding>{props.children}</Container>;
};

export default BorrowerContainer;