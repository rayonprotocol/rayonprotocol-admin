import React, { Component, FormEvent, SyntheticEvent } from 'react';
// model
import { BorrowerApp } from '../../../../shared/borrower/model/Borrower';

// styles
import styles from './BorrowerAppFormView.scss';
import BorderTextInput from 'common/view/input/BorderTextInput';
import BorrowerSubSectionContainer from './BorrowerSubSectionContainer';
import { TextSubmitButton } from 'common/view/button/TextButtons';

enum FormMode {
  ADD = 'add',
  EDIT = 'edit',
}

interface BorrowerAppFormViewProps {
  mode: FormMode;
  borrowerApp?: BorrowerApp;
  onBorrowerAppSubmitted: (address: BorrowerApp['address'], name: BorrowerApp['name'], mode: FormMode) => void;
}

interface BorrowerAppFormViewState {
  draft: {
    address: string;
    name: string
  };
  filledbBorrowerApp?: BorrowerApp;
}

class BorrowerAppFormView extends Component<BorrowerAppFormViewProps, BorrowerAppFormViewState> {

  state = {
    draft: this.props.mode === FormMode.EDIT
      ? {
        address: this.props.borrowerApp.address,
        name: this.props.borrowerApp.name,
      } : {
        address: '',
        name: '',
      },
  };

  createDraftChangedHandler = (draftProp: keyof BorrowerAppFormViewState['draft']) => (event: SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    this.setState(() => ({
      ...this.state,
      draft: {
        ...this.state.draft,
        [draftProp]: value,
      },
    }));
  }

  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { mode, onBorrowerAppSubmitted } = this.props;
    const { address, name } = this.state.draft;

    onBorrowerAppSubmitted(address, name, mode);
  }

  render() {
    const { mode } = this.props;
    const { name, address } = this.state.draft;
    const formTitle = mode === FormMode.EDIT ? 'Edit borrower app' : 'Add borrower app';

    return (
      <form className={styles.borrowerAppFormView} onSubmit={this.handleSubmit}>
        <BorrowerSubSectionContainer title={formTitle}>
          <ul>
            <li>
              <BorderTextInput title='Name' onChangeTextInput={this.createDraftChangedHandler('name')} value={name} />
            </li>
            <li>
              <BorderTextInput title='Address' disabled={mode === FormMode.EDIT} onChangeTextInput={this.createDraftChangedHandler('address')} value={address} />
            </li>
          </ul>
          <div className={styles.buttonWrap}>
            <TextSubmitButton filled value='Submit' />

          </div>
        </BorrowerSubSectionContainer>
      </form>
    );
  }
};

export { FormMode };
export default BorrowerAppFormView;
