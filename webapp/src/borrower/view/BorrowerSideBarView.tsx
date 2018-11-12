import React, { StatelessComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
// model
import { BorrowerApp } from '../../../../shared/borrower/model/Borrower';

// styles
import styles from './BorrowerSideBarView.scss';

interface BorrowerSideBarViewProps {
  borrowerApps: BorrowerApp[];
  selectedBorrowerAppAddress: BorrowerApp['address'];
  buttonElement: JSX.Element;
}

const BorrowerSideBarView: StatelessComponent<BorrowerSideBarViewProps> = props => {
  return (
    <aside className={styles.borrowerSideBarView}>
      <ul>
        {props.borrowerApps.map((borrowerApp, index) =>
          <li key={index} className={classNames({ [styles.selected]: borrowerApp.address === props.selectedBorrowerAppAddress })}>
            <Link to={{ pathname: '/borrower', search: `?baa=${borrowerApp.address}` }}>{borrowerApp.name}</Link>
          </li>,
        )}
      </ul>
      {props.buttonElement && <div className={styles.buttonWrap}>{props.buttonElement}</div>}
    </aside>
  );
};

export default BorrowerSideBarView;