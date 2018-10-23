import React, { Component } from 'react';

// model
import { ContractOverview } from '../../../../shared/contract/model/Contract';

// view
import SectionTitle from 'common/view/section/SectionTitle';

// styles
import styles from './ContractOverviewView.scss';

interface ContractOverviewViewProps {
  contractOverviews: ContractOverview;
  selContractAddr: string;
  onSelectContract: (option: string) => void;
}

class ContractOverviewView extends Component<ContractOverviewViewProps, {}> {
  renderTitleAndCombobox() {
    const { contractOverviews } = this.props;
    return (
      <SectionTitle title={'Overview'}>
        <div className={styles.contractCombobox}>
          <div className={styles.combobox}>
            <span className={styles.comboboxLabel}>{'Current contract : '}</span>
            <select onChange={event => this.props.onSelectContract(event.target.value)}>
              {Object.keys(contractOverviews).map((contractAddr, index) => {
                return (
                  <option key={index} value={contractAddr}>
                    {contractOverviews[contractAddr].name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </SectionTitle>
    );
  }

  render() {
    const { contractOverviews, selContractAddr } = this.props;
    return (
      <div className={styles.contractOverview}>
        {this.renderTitleAndCombobox()}
        <section className={styles.overview}>
          <div className={styles.owner}>
            <p>{'Contract Owner'}</p>
            <p>{contractOverviews[selContractAddr].owner}</p>
          </div>
          <div className={styles.addr}>
            <p>{'Contract Address'}</p>
            <p>{selContractAddr}</p>
          </div>
        </section>
      </div>
    );
  }
}

export default ContractOverviewView;
