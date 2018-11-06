import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

// model
import { newContract } from '../../../../shared/contract/model/Contract';

// view
import SectionTitle from 'common/view/section/SectionTitle';

interface ContractInfoViewProps {
  contracts: newContract[];
  onClickRegisterModalOpen: () => void;
  onClickUpgradeModalOpen: () => void;
}

class ContractInfoView extends Component<ContractInfoViewProps, {}> {
  render() {
    return (
      <Fragment>
        <SectionTitle title={`Contract : `}>
          <div>
            <div onClick={this.props.onClickRegisterModalOpen}>Register</div>
            <div onClick={this.props.onClickUpgradeModalOpen}>Upgrade</div>
          </div>
        </SectionTitle>
        <ReactTable
          data={this.props.contracts}
          columns={[
            {
              Header: 'Name',
              accessor: 'name',
            },
            {
              Header: 'Proxy Contract',
              accessor: 'proxyAddress',
            },
            {
              Header: 'Interface Contract',
              accessor: 'interfaceAddress',
            },
            {
              Header: 'Version',
              accessor: 'version',
            },
            {
              Header: 'Updated',
              accessor: 'updatedAt',
            },
          ]}
          defaultPageSize={5}
          className={'-striped -highlight'}
        />
      </Fragment>
    );
  }
}

export default ContractInfoView;
