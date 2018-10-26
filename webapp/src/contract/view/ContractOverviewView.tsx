import React, { Component } from 'react';

// model
import Contract from '../../../../shared/contract/model/Contract';

// view
import SectionTitle from 'common/view/section/SectionTitle';

// styles
import styles from './ContractOverviewView.scss';

interface ContractOverviewViewProps {
  contracts: Contract[];
  selContractAddr: string;
  onSelectContract: (option: string) => void;
}

class ContractOverviewView extends Component<ContractOverviewViewProps, {}> {
  public getContract(): Contract {
    if (this.props.contracts === undefined) return;
    const targetContract = this.props.contracts.filter(contract => {
      if (contract.address === this.props.selContractAddr) return contract.owner;
    });
    return targetContract.length ? targetContract.pop() : null;
  }

  renderTitleAndCombobox() {
    const { contracts } = this.props;
    return (
      <SectionTitle title={'Overview'}>
        <div className={styles.contractCombobox}>
          <div className={styles.combobox}>
            <span className={styles.comboboxLabel}>{'Current contract : '}</span>
            <select onChange={event => this.props.onSelectContract(event.target.value)}>
              {contracts.map((contract, index) => {
                return (
                  <option key={index} value={contract.address}>
                    {contract.name}
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
    const { selContractAddr } = this.props;
    const contract = this.getContract();
    return (
      <div className={styles.contractOverview}>
        {this.renderTitleAndCombobox()}
        <section className={styles.overview}>
          <div className={styles.owner}>
            <p>{'Contract Owner'}</p>
            <p>{contract.owner}</p>
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
