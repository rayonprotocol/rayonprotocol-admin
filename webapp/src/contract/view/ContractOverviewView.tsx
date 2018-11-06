import React, { Component, Fragment } from 'react';

// model
import { newContract } from '../../../../shared/contract/model/Contract';

// view
import SectionTitle from 'common/view/section/SectionTitle';

// util
import ObjectUtil from '../../../../shared/common/util/ObjectUtil';

// styles
import styles from './ContractOverviewView.scss';

interface ContractOverviewViewProps {
  contract: newContract;
  onSelectContract: (option: string) => void;
}

class ContractOverviewView extends Component<ContractOverviewViewProps, {}> {
  render() {
    const { contract } = this.props;
    return (
      <div className={styles.contractOverview}>
        <SectionTitle title={'Overview'} />
        <section className={styles.overview}>
          {ObjectUtil.isEmpty(contract) ? (
            <div>{'Contract is undefined'}</div>
          ) : (
            <Fragment>
              <div>
                <span>{'Name : '}</span>
                <span>{contract.name}</span>
              </div>
              <div>
                <span>{'Proxy Contract : '}</span>
                <span>{contract.proxyAddress}</span>
              </div>
              <div>
                <span>{'Interface Contract : '}</span>
                <span>{contract.interfaceAddress}</span>
              </div>
              <div>
                <span>{'Version : '}</span>
                <span>{contract.version}</span>
              </div>
              <div>
                <span>{'Updated : '}</span>
                <span>{contract.updatedAt}</span>
              </div>
              <div>
                <span>{'Deployed Block  :'}</span>
                <span>{contract.blockNumber}</span>
              </div>
            </Fragment>
          )}
        </section>
      </div>
    );
  }
}

export default ContractOverviewView;
