import React, { Component } from 'react';

// model
import ContractConfigure from '../../../../shared/common/model/ContractConfigure';

// styles
import styles from './ContractTopView.scss';

interface ContractTopViewProps {
  currentContractAddress: string;
  onSelectOption: (option: string) => void;
}

class ContractTopView extends Component<ContractTopViewProps, {}> {
  render() {
    const rayonContractAddresses: Map<string, string> = ContractConfigure.getRayonContractAddresses();
    const ownerAddresses: Map<string, string> = ContractConfigure.getOwnerAddresses();
    return (
      <div>
        <select onChange={event => this.props.onSelectOption(event.target.value)}>
          {Array.from(rayonContractAddresses.keys()).map((contractAddress, index) => {
            return (
              <option key={index} value={contractAddress}>
                {rayonContractAddresses.get(contractAddress)}
              </option>
            );
          })}
        </select>
        <section>
          <div className={styles.overviewSectionTitle}>Overview</div>
          <div>
            <p>
              <span>{'Contract Owner'}</span>
              <span>{ownerAddresses.get(this.props.currentContractAddress)}</span>
            </p>
            <p>
              <span>{'Contract Address'}</span>
              <span>{this.props.currentContractAddress}</span>
            </p>
          </div>
        </section>
      </div>
    );
  }
}

export default ContractTopView;
