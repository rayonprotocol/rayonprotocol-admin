import React, { StatelessComponent, Component, EventHandler, FormEvent, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
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
  onBorrowerAppSumitted: (name: BorrowerApp['name'], address: BorrowerApp['address'], mode: FormMode) => void;
}

interface BorrowerAppFormViewState {
  draft: {
    name: string
    address?: string;
  };
  filledbBorrowerApp?: BorrowerApp;
}

class BorrowerAppFormView extends Component<BorrowerAppFormViewProps, BorrowerAppFormViewState> {

  state = {
    draft: this.props.mode === FormMode.EDIT
      ? {
        name: this.props.borrowerApp.name,
        address: this.props.borrowerApp.address,
      } : {
        name: '',
        address: '',
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
    const { mode, onBorrowerAppSumitted } = this.props;
    const { name, address } = this.state.draft;

    onBorrowerAppSumitted(name, address, mode);
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
