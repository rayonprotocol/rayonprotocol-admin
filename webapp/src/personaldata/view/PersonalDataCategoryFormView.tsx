import React, { Component, FormEvent, SyntheticEvent, Fragment, ComponentType } from 'react';
// model
import { PersonalDataCategory, RewardCycle } from '../../../../shared/personaldata/model/PerosnalData';

// styles
import styles from './PersonalDataCategoryFormView.scss';

// view
import SubSectionContainer from 'common/view/container/SubSectionContainer';
import BorderTextInput from 'common/view/input/BorderTextInput';
import { TextSubmitButton } from 'common/view/button/TextButtons';
import BorderTextSelect from 'common/view/input/BorderTextSelect';
import { BorrowerApp } from '../../../../shared/borrower/model/Borrower';

enum FormMode {
  ADD = 'add',
  EDIT = 'edit',
  REMOVE = 'remove',
}

// treat form data as string type
export interface FormData {
  code: string;
  category1: string;
  category2: string;
  category3: string;
  borrowerAppAddress: PersonalDataCategory['borrowerAppAddress'];
  score: string;
  rewardCycle: PersonalDataCategory['rewardCycle'];
}

interface SelectOptionData {
  value: string | number;
  label?: string | number;
}

interface PersonalDataCategoryFormDataElementsProps {
  mode: FormMode;
  formData: FormData;
  borrowerAppAddressOptions: SelectOptionData[];
  rewardCycleOptions: SelectOptionData[];
  onElementValueChange: (elementName: keyof FormData, event: SyntheticEvent<HTMLInputElement> | SyntheticEvent<HTMLSelectElement>) => void;
}

const PersonalDataCategoryFormDataElements = (props: PersonalDataCategoryFormDataElementsProps) => {
  const capitalizeName = (name: keyof FormData) => name.slice(0, 1).toUpperCase().concat(name.slice(1));
  const optionDataToElement = ({ label, value }: SelectOptionData) =>
    <option key={value} value={value}>{typeof label !== 'undefined' ? label : value}</option>;
  const { mode, formData, borrowerAppAddressOptions, rewardCycleOptions, onElementValueChange } = props;

  const elementConfigs: { [elementName in keyof FormData]: { type: ComponentType, editable: boolean } } = { // the order of config props matters
    code: {
      type: BorderTextInput,
      editable: mode === FormMode.ADD,
    },
    category1: {
      type: BorderTextInput,
      editable: mode === FormMode.ADD || mode === FormMode.EDIT,
    },
    category2: {
      type: BorderTextInput,
      editable: mode === FormMode.ADD || mode === FormMode.EDIT,
    },
    category3: {
      type: BorderTextInput,
      editable: mode === FormMode.ADD || mode === FormMode.EDIT,
    },
    borrowerAppAddress: {
      type: BorderTextSelect,
      editable: mode === FormMode.ADD,
    },
    score: {
      type: BorderTextInput,
      editable: mode === FormMode.ADD || mode === FormMode.EDIT,
    },
    rewardCycle: {
      type: BorderTextSelect,
      editable: mode === FormMode.ADD || mode === FormMode.EDIT,
    },
  };
  const elementNames = Object.keys(elementConfigs);
  const formDataElements = elementNames.map((elementName: keyof FormData) => {
    const { type, editable } = elementConfigs[elementName];
    switch (type) {
      case BorderTextInput: return (
        <li key={elementName}>
          <BorderTextInput
            disabled={!editable}
            title={capitalizeName(elementName)}
            onChangeTextInput={onElementValueChange.bind(null, elementName)}
            value={typeof formData[elementName] !== 'undefined' ? formData[elementName] : ''}
          />
        </li>
      );
      case BorderTextSelect: return (
        <li key={elementName}>
          <BorderTextSelect
            disabled={!editable}
            title={capitalizeName(elementName)}
            value={formData[elementName]}
            onChangeTextOption={onElementValueChange.bind(null, elementName)}
          >
            {Array.prototype.map.call(
              elementName === 'rewardCycle' ? rewardCycleOptions : borrowerAppAddressOptions,
              optionDataToElement,
            )}
          </BorderTextSelect>
        </li>
      );
      default:
        break;
    }
  });

  const sortedFormDataElements = formDataElements.sort((a, b) =>
    elementNames.indexOf(a.key.toString()) - elementNames.indexOf(b.key.toString()),
  );

  return (
    <Fragment>
      {sortedFormDataElements}
    </Fragment>
  );
};

interface PersonalDataCategoryFormViewProps {
  mode: FormMode;
  dataCategory?: PersonalDataCategory;
  borrowerApps: BorrowerApp[];
  onDataCategorySubmitted: (formData: FormData, mode: FormMode) => void;
}

interface PersonalDataCategoryFormViewState {
  draft: FormData;
  confirmReady: boolean;
}

class PersonalDataCategoryFormView extends Component<PersonalDataCategoryFormViewProps, PersonalDataCategoryFormViewState> {
  rewardCycleOptions = Object.keys(RewardCycle).map(rewardCycleName => ({ value: RewardCycle[rewardCycleName], label: rewardCycleName }))
  state = {
    draft: this.props.mode === FormMode.ADD
      ? {
        category1: '',
        category2: '',
        category3: '',
        borrowerAppAddress: this.props.borrowerApps && this.props.borrowerApps[0].address,
        rewardCycle: this.rewardCycleOptions[0].value,
      } as FormData
      : {
        code: String(this.props.dataCategory.code),
        category1: this.props.dataCategory.category1,
        category2: this.props.dataCategory.category2,
        category3: this.props.dataCategory.category3,
        borrowerAppAddress: this.props.dataCategory.borrowerAppAddress,
        score: String(this.props.dataCategory.score),
        rewardCycle: this.props.dataCategory.rewardCycle,
      },
    confirmReady: false,
  };

  handleDraftPropChange = (draftPropName: keyof PersonalDataCategoryFormViewState['draft'], event: SyntheticEvent<HTMLInputElement> | SyntheticEvent<HTMLSelectElement>) => {
    const value: string = (event.currentTarget.value || '').trim();
    console.log(draftPropName, value);
    this.setState(() => ({
      draft: {
        ...this.state.draft,
        [draftPropName]: value,
      },
    }));
  }

  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { mode, onDataCategorySubmitted } = this.props;
    console.log({ draft: this.state.draft });
    onDataCategorySubmitted(this.state.draft, mode);
    this.setState(() => ({ confirmReady: true }));
  }

  render() {
    const { mode, borrowerApps } = this.props;
    const { draft, confirmReady } = this.state;
    const formTitle = ({
      [FormMode.ADD]: 'Add personal data category',
      [FormMode.EDIT]: 'Edit personal data category',
      [FormMode.REMOVE]: 'Remove personal data category',
    })[mode];
    return (
      <form className={styles.personalDataCategoryFormView} onSubmit={this.handleSubmit}>
        <SubSectionContainer title={formTitle}>
          <ul>
            <PersonalDataCategoryFormDataElements
              mode={mode}
              formData={draft}
              borrowerAppAddressOptions={borrowerApps.map(({ name, address }) => ({ value: address, label: name }))}
              rewardCycleOptions={this.rewardCycleOptions}
              onElementValueChange={this.handleDraftPropChange} />
          </ul>
          <div className={styles.buttonWrap}>
            <TextSubmitButton filled danger={mode === FormMode.REMOVE} disabled={confirmReady} value={confirmReady ? 'Confirm transaction' : 'Submit'} />
          </div>
        </SubSectionContainer>
      </form>
    );
  }
};

export { FormMode };
export default PersonalDataCategoryFormView;
