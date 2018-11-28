import React, { StatelessComponent } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

// model
import { MemberWithBorrower, BorrowerWithDataItems } from '../../../../shared/borrower/model/Borrower';

// view
import SubSectionContainer from 'common/view/container/SubSectionContainer';
import { PersonalDataItemWithCategory } from '../../../../shared/personaldata/model/PerosnalData';

interface BorrowerDataItemTableViewProps {
  borrower: BorrowerWithDataItems;
}

const BorrowerDataItemTableView: StatelessComponent<BorrowerDataItemTableViewProps> = props => {
  const categoryPropSelector = (propName: keyof PersonalDataItemWithCategory['category']) => ({ category }: PersonalDataItemWithCategory) => category && category[propName] || undefined;
  const filterRow = (id: string) => (filter, row) => (row[id] || '').toUpperCase().includes(filter.value.toUpperCase());
  const CategoryCell = ({ original, value }) => {
    return typeof original.category !== 'undefined'
      ? <span>{value}</span>
      : <span style={{ color: 'red' }}>{value || 'Deleted Category'}</span>;
  };
  const columns = [
    {
      id: 'code',
      Header: 'Code',
      accessor: 'code',
      maxWidth: 200,
      filterMethod: filterRow('code'),
      Cell: CategoryCell,
    },
    {
      id: 'category1',
      Header: 'Category1',
      accessor: categoryPropSelector('category1'),
      maxWidth: 250,
      filterMethod: filterRow('category1'),
      Cell: CategoryCell,
    },
    {
      id: 'category2',
      Header: 'Category2',
      accessor: categoryPropSelector('category2'),
      maxWidth: 250,
      filterMethod: filterRow('category2'),
      Cell: CategoryCell,
    },
    {
      id: 'category3',
      Header: 'Category3',
      accessor: categoryPropSelector('category3'),
      maxWidth: 250,
      filterMethod: filterRow('category3'),
      Cell: CategoryCell,
    },
    {
      id: 'score',
      Header: 'Score',
      accessor: categoryPropSelector('score'),
      maxWidth: 100,
      filterMethod: filterRow('score'),
      Cell: CategoryCell,
    },
    {
      id: 'updatedDate',
      Header: 'Updated Date',
      accessor: categoryPropSelector('updatedDate'),
      maxWidth: 100,
      filterMethod: filterRow('updatedDate'),
      Cell: CategoryCell,
    },
    {
      id: 'dataHash',
      Header: 'Hash',
      accessor: 'dataHash',
      maxWidth: 100,
      filterable: false,
    },
  ];

  return <SubSectionContainer title='Personal data list'>
    <h4>borrower: {props.borrower.address}</h4>
    <ReactTable
      data={props.borrower.dataItems}
      filterable
      defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
      columns={columns}
      defaultPageSize={10}
      className={'-striped -highlight'}
    />
  </SubSectionContainer>;
};

export default BorrowerDataItemTableView;
