import React, { Component } from 'react';

// model
import { ContractOverview } from '../../../../shared/contract/model/Contract';

// styles
import styles from './ContractTopView.scss';

interface ContractTopViewProps {
  contractOverviews: ContractOverview;
  selContractAddr: string;
  onSelectOption: (option: string) => void;
}

class ContractTopView extends Component<ContractTopViewProps, {}> {
  render() {
    const { contractOverviews, selContractAddr } = this.props;
    return (
      <div className={styles.contractTopView}>
        <select onChange={event => this.props.onSelectOption(event.target.value)}>
          {Object.keys(contractOverviews).map((contractAddr, index) => {
            return (
              <option key={index} value={contractAddr}>
                {contractOverviews[contractAddr].name}
              </option>
            );
          })}
        </select>
        <section>
          <div className={styles.overviewSectionTitle}>Overview</div>
          <div>
            <p>
              <span>{'Contract Owner'}</span>
              <span>{contractOverviews[selContractAddr].owner}</span>
            </p>
            <p>
              <span>{'Contract Address'}</span>
              <span>{selContractAddr}</span>
            </p>
          </div>
        </section>
      </div>
    );
  }
}

export default ContractTopView;
