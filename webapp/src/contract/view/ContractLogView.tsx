import React, { Component } from 'react';

// view
import ComboBox from 'common/view/combobox/ComboBox';
import SectionTitle from 'common/view/section/SectionTitle';

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
      <SectionTitle title={'Transaction Log'}>
        <ComboBox
          options={this.props.logTypes}
          label={'Log type : '}
          onSelectOption={this.props.onSelectLogType.bind(this)}
        />
      </SectionTitle>
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
