import React, { Component } from 'react';

// view
import ComboBox from 'common/view/combobox/ComboBox';

// styles
import styles from './ContractLogView.scss';

interface ContractLogViewProps {
  selLogType: string;
  logTypes: string[];
  onSelectLogType: (type: string) => void;
}

class ContractLogView extends Component<ContractLogViewProps, {}> {
  renderTitleAndTabView() {
    return (
      <div className={styles.logTitleSection}>
        <div className={styles.title}>{'Transaction Log'}</div>
        <ComboBox
          options={this.props.logTypes}
          label={'Log type : '}
          onSelectOption={this.props.onSelectLogType.bind(this)}
        />
      </div>
    );
  }

  render() {
    return (
      <div className={styles.contractLogView}>
        {this.renderTitleAndTabView()}
        {this.props.children}
      </div>
    );
  }
}

export default ContractLogView;
