import React, { Component, StatelessComponent } from 'react';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';
import 'react-table/react-table.css';

// styles
import styles from './BorrowerMemberTableView.scss';

// model
import { BorrowerAppWithMembers, MemberWithBorrower } from '../../../../shared/borrower/model/Borrower';

// util
import DateUtil from '../../../../shared/common/util/DateUtil';
import SectionTitle from 'common/view/section/SectionTitle';
import BorrowerSubSectionContainer from './BorrowerSubSectionContainer';

interface BorrowerMemberTableViewProps {
  borrowerAppWithMembers: BorrowerAppWithMembers;
}

const BorrowerMemberTableView: StatelessComponent<BorrowerMemberTableViewProps> = props => {
  const borrowerPropSelector = (propName: keyof MemberWithBorrower['borrower']) => ({ borrower }: MemberWithBorrower) => borrower && borrower[propName] || undefined;
  const borrowerMemberPropSelector = (propName: keyof MemberWithBorrower) => (member: MemberWithBorrower) => member[propName] || undefined;
  const filterRow = (id: string) => (filter, row) => (row[id] || '').toUpperCase().includes(filter.value.toUpperCase());
  const columns = [
    {
      id: 'address',
      Header: 'Address',
      accessor: borrowerPropSelector('address'),
      maxWidth: 200,
      filterMethod: filterRow('address')
    },
    {
      id: 'token',
      Header: 'Token',
      accessor: 'token', // token required
      maxWidth: 160,
      filterable: false,
    },
    {
      id: 'joinedDate',
      Header: 'Joined Date',
      accessor: borrowerMemberPropSelector('joinedDate'),
      maxWidth: 100,
      filterMethod: filterRow('joinedDate')
    },
    {
      id: 'score',
      Header: 'Score',
      accessor: 'score', // score required
      maxWidth: 100,
      filterable: false,
    },
    {
      id: 'personalData',
      Header: 'Personal Data',
      accessor: 'personalData', // personalData required
      maxWidth: 100,
      filterable: false,
    },
    {
      id: 'etc',
      Header: 'Etc.',
      accessor: 'etc',
      maxWidth: 300,
      filterable: false,
      Cell: row => (
        <ul className={styles.etcCell}>
          <li>
            <a href={'/'} target={'_blank'}>Token</a>
          </li>
          <li>
            <a href={'/'} target={'_blank'}>Activity</a>
          </li>
          <li>
            <a href={'/'} target={'_blank'}>Persontal Data</a>
          </li>
        </ul>
      )
    },
  ]

  return <BorrowerSubSectionContainer title='Borrowers'>
    <ReactTable
      data={props.borrowerAppWithMembers.members}
      filterable
      defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
      columns={columns}
      defaultPageSize={10}
      className={'-striped -highlight'}
    />
  </BorrowerSubSectionContainer>;
};

export default BorrowerMemberTableView;
