import React, { Component } from 'react';

// model
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

// styles
import styles from './ContractTopView.scss';

class ContractTopView extends Component<{}, {}> {
  render() {
    const rayonContractAddresses: Map<string, string> = ContractConfigure.getRayonContractAddresses();
    return (
      <div>
        <select>
          {Array.from(rayonContractAddresses.keys()).map((contractName, index) => {
            return (
              <option key={index} value={rayonContractAddresses.get(contractName)}>
                {contractName}
              </option>
            );
          })}
        </select>
        <section>
          <div className={styles.overviewSectionTitle}>Overview</div>
          <div>
            <p>
              <span>{'Contract Owner'}</span>
              <span>{}</span>
            </p>
            <p>
              <span>{'Contract Address'}</span>
              <span>{}</span>
            </p>
          </div>
        </section>
      </div>
    );
  }
}

export default ContractTopView;
