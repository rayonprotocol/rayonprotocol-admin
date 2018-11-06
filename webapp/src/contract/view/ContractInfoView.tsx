import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

// model
import { newContract } from '../../../../shared/contract/model/Contract';

// view
import RayonButton from 'common/view/button/RayonButton';
import SectionTitle from 'common/view/section/SectionTitle';

// util
import StringUtil from '../../../../shared/common/util/StringUtil';
import DateUtil from '../../../../shared/common/util/DateUtil';

// styles
import styles from './ContractInfoView.scss';

interface ContractInfoViewProps {
  contracts: newContract[];
  onClickRegisterModalOpen: () => void;
  onClickUpgradeModalOpen: () => void;
  onSelectContract: (option: string) => void;
}

class ContractInfoView extends Component<ContractInfoViewProps, {}> {
  render() {
    return (
      <Fragment>
        <SectionTitle title={`Contract : ${this.props.contracts.length}`}>
          <div className={styles.modalButtonSection}>
            <RayonButton
              className={styles.registerButton}
              title={'Register'}
              onClickButton={this.props.onClickRegisterModalOpen}
            />
            <RayonButton
              className={styles.upgradeButton}
              title={'Upgrade'}
              onClickButton={this.props.onClickUpgradeModalOpen}
            />
          </div>
        </SectionTitle>
        <ReactTable
          data={this.props.contracts}
          columns={[
            {
              Header: 'Name',
              accessor: 'name',
              maxWidth: 200,
            },
            {
              Header: 'Proxy Contract',
              accessor: 'proxyAddress',
              Cell: row => <div>{StringUtil.trimAddress(row.value)}</div>,
            },
            {
              Header: 'Interface Contract',
              accessor: 'interfaceAddress',
              Cell: row => <div>{StringUtil.trimAddress(row.value)}</div>,
            },
            {
              Header: 'Version',
              accessor: 'version',
              maxWidth: 130,
              style: {
                textAlign: 'center',
              },
            },
            {
              Header: 'Updated',
              accessor: 'updatedAt',
              maxWidth: 130,
              Cell: row => <div>{DateUtil.timstampCommonFormConverter(row.value)}</div>,
              style: {
                textAlign: 'center',
              },
            },
            {
              Header: 'More',
              maxWidth: 100,
              filterable: false,
              Cell: row => (
                <div className={styles.moreBtn} onClick={() => this.props.onSelectContract(row.original.interfaceAddress)}>
                  <span>&#x2295;</span>
                </div>
              ),
              style: {
                fontSize: 25,
                textAlign: 'center',
                padding: '0',
                cursor: 'pointer',
              },
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
