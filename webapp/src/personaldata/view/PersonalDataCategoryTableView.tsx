import React, { StatelessComponent } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';


// styles
import styles from './PersonalDataCategoryTableView.scss';

// model
import { PersonalDataCategory, RewardCycle } from '../../../../shared/personaldata/model/PerosnalData';

// view
import SubSectionContainer from 'common/view/container/SubSectionContainer';
import { TextButton } from 'common/view/button/TextButtons';
import { BorrowerApp } from '../../../../shared/borrower/model/Borrower';

interface PersonalDataCategoryTableViewProps {
  dataCategories: Array<PersonalDataCategory & { borrowerApp: BorrowerApp }>;
  onAddClick: () => void;
  onEditClick: (code: number) => void;
  onRemoveClick: (code: number) => void;
}

const PersonalDataCategoryTableView: StatelessComponent<PersonalDataCategoryTableViewProps> = props => {
  const borrowerPropSelector = (propName: keyof BorrowerApp) => ({ borrowerApp }: PersonalDataCategoryTableViewProps['dataCategories'][number]) => borrowerApp && borrowerApp[propName] || undefined;
  const filterRow = (id: string) => (filter, row) => (row[id] || '').toUpperCase().includes(filter.value.trim().toUpperCase());
  const unfilteringConditionValue = 'All';
  const columns = [
    {
      id: 'code',
      Header: 'Code',
      accessor: 'code',
      maxWidth: 80,
      filterMethod: filterRow('code'),
    },
    {
      id: 'category1',
      Header: 'Category1',
      accessor: 'category1',
      maxWidth: 250,
      filterMethod: filterRow('category1'),
    },
    {
      id: 'category2',
      Header: 'Category2',
      accessor: 'category2',
      maxWidth: 250,
      filterMethod: filterRow('category2'),
    },
    {
      id: 'category3',
      Header: 'Category3',
      accessor: 'category3',
      maxWidth: 250,
      filterMethod: filterRow('category3'),
    },
    {
      id: 'borrowerApp',
      Header: 'BorrowerApp',
      accessor: borrowerPropSelector('name'),
      maxWidth: 100,
      filterMethod: filterRow('name')
    },
    {
      id: 'score',
      Header: 'Score',
      accessor: 'score',
      maxWidth: 100,
      filterMethod: filterRow('score'),
    },
    {
      id: 'updatedDate',
      Header: 'Updated Date',
      accessor: 'updatedDate',
      maxWidth: 100,
      filterMethod: filterRow('updatedDate'),
    },
    {
      id: 'rewardCycle',
      Header: 'Reward Cycle',
      accessor: 'rewardCycle',
      maxWidth: 100,
      Cell: ({ value: rewardCycle }) => RewardCycle[rewardCycle],
      Filter: ({ filter, onChange }) =>
        <select
          onChange={event => onChange(event.target.value)}
          style={{ width: '100%' }}
          value={filter ? filter.value : unfilteringConditionValue}
        >
          <option value={unfilteringConditionValue}>{unfilteringConditionValue}</option>
          {[
            RewardCycle.DAILY,
            RewardCycle.WEEKLY,
            RewardCycle.MONTHLY,
            RewardCycle.ANNUALLY,
          ].map(rewardCycle => {
            const rewardCycleName = RewardCycle[rewardCycle];
            return (<option key={rewardCycleName} value={rewardCycle}>{rewardCycleName}</option>)
          })}
        </select>,
      filterMethod: (filter, row) => {
        const filteringValue = filter.value;
        const rowValue = row[filter.id];
        return filteringValue === unfilteringConditionValue || filteringValue === rowValue;
      },
    },
    {
      id: 'etc',
      Header: 'Etc.',
      accessor: 'etc',
      maxWidth: 300,
      filterable: false,
      Cell: ({ row }) => (
        <ul className={styles.etcCell}>
          <li>
            <TextButton bordered onClick={props.onEditClick.bind(null, row.code)}>Edit</TextButton>
          </li>
          <li>
            <TextButton bordered danger onClick={props.onRemoveClick.bind(null, row.code)}>Remove</TextButton>
          </li>
        </ul>
      ),
    },
  ];

  return <SubSectionContainer title={`Categories: ${props.dataCategories && props.dataCategories.length || 0}`}>
    <TextButton bordered onClick={props.onAddClick}>Add New Category</TextButton>
    <ReactTable
      data={props.dataCategories}
      filterable
      defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
      columns={columns}
      defaultPageSize={10}
      className={'-striped -highlight'}
    />
  </SubSectionContainer>;
};

export default PersonalDataCategoryTableView;
