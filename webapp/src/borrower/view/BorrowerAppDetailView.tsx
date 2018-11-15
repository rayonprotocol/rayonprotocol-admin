import React, { StatelessComponent, Fragment } from 'react';

// styles
import styles from './BorrowerAppDetailView.scss';

// model
import { BorrowerAppWithMembers } from '../../../../shared/borrower/model/Borrower';
import BorrowerSubSectionContainer from './BorrowerSubSectionContainer';

interface BorrowerAppDetailSubSectionViewProps {
  items: Array<{ label: string; value: string | number }>;
}

const BorrowerAppDetailSubSectionView: StatelessComponent<BorrowerAppDetailSubSectionViewProps> = props => {
  return (
    <ul className={styles.borrowerAppSubSection}>
      {props.items.map((item, i) => (
        <li key={i} >
          <h4>{item.label}</h4>
          <p>{item.value}</p>
        </li>
      ))}
    </ul>
  );
};

interface BorrowerAppDetailViewProps {
  borrowerAppWithMembers: BorrowerAppWithMembers;
}

const BorrowerAppDetailView: StatelessComponent<BorrowerAppDetailViewProps> = props => {
  const { borrowerAppWithMembers } = props;
  const details = [
    {
      title: 'Information',
      items: [
        {
          label: 'address',
          value: borrowerAppWithMembers.address,
        },
        {
          label: 'last updated date',
          value: borrowerAppWithMembers.updatedDate,
        },
        {
          label: 'joined borrowers',
          value: (borrowerAppWithMembers.members && borrowerAppWithMembers.members.length || 0),
        },
      ],
    },
  ];

  return (
    <Fragment>
      {details.map((detail, i) => (
        <BorrowerSubSectionContainer key={i} title={detail.title}>
          <BorrowerAppDetailSubSectionView key={i} items={detail.items} />
        </BorrowerSubSectionContainer>
      ))}
    </Fragment>
  );
};

export default BorrowerAppDetailView;