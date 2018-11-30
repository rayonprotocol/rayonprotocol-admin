import React, { Component, Fragment } from 'react';
import { createSelector } from 'reselect';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { indexByKey, denormalize } from '../../common/util/entity';

// model
import { BorrowerApp } from '../../../../shared/borrower/model/Borrower';

// dc
import PersonalDataDC from 'personaldata/dc/PersonalDataDC';

// view
import Loading from 'common/view/loading/Loading';
import Container from 'common/view/container/Container';
import RayonModalView from 'common/view/modal/RayonModalView';
import PersonalDataCategoryFormView, { FormMode, FormData } from 'personaldata/view/PersonalDataCategoryFormView';
import { PersonalDataCategory, PersonalDataItem } from '../../../../shared/personaldata/model/PerosnalData';
import PersonalDataCategoryTableView from 'personaldata/view/PersonalDataCategoryTableView';
import BorrowerDC from 'borrower/dc/BorrowerDC';
import ConfirmModalView from 'common/view/modal/ConfirmModalView';

type PersonalDataVCProps = RouteComponentProps<{}>;

enum ModalState {
  CLOSED,
  FORM_OPEN,
  CONFIRM_OPEN,
}
interface PersonalDataVCState {
  modal: ModalState;
  dataCategories: PersonalDataCategory[];
  dataItems: PersonalDataItem[];
  borrowerApps: BorrowerApp[];
  formMode: FormMode;
  selectedDataCategoryCode: number;
}

const borrowerAppByAddressSelector = ({ borrowerApps }: PersonalDataVCState) => indexByKey(borrowerApps, entity => entity.address, true);
const dataCategoryByCodeSelector = ({ dataCategories }: PersonalDataVCState) => indexByKey(dataCategories, entity => entity.code, true);
const dataCategoriesSelector = ({ dataCategories }: PersonalDataVCState) => dataCategories;
const dataItemsByCodeSelector = ({ dataItems }: PersonalDataVCState) => indexByKey(dataItems, entity => entity.code, false);

const dataCategoryWithBorrowAppsSelector = createSelector(
  dataCategoriesSelector,
  borrowerAppByAddressSelector,
  (dataCategories, borrowerAppByAddress) => denormalize(
    dataCategories,
    dataCategory => ({
      borrowerApp: borrowerAppByAddress[dataCategory.borrowerAppAddress],
    }),
  ));
const dataCategoryByCodeWithDataItemsSelector = createSelector(
  dataCategoryByCodeSelector,
  dataItemsByCodeSelector,
  (dataCategoryByCode, dataItemsByCode) => denormalize(
    dataCategoryByCode,
    dataCategory => ({
      dataItems: dataItemsByCode[dataCategory.code],
    }),
  ));


class PersonalDataVC extends Component<PersonalDataVCProps, PersonalDataVCState> {
  constructor(props) {
    super(props);
    this.state = {
      modal: ModalState.CLOSED,
      dataCategories: [],
      dataItems: [],
      borrowerApps: [],
      formMode: undefined,
      selectedDataCategoryCode: undefined,
    };
  }

  observerUnregisterers = [];

  componentDidMount() {
    this.observerUnregisterers.push(
      PersonalDataDC.registerDataCategoriesObserver(dataCategories => this.setState(() => ({
        dataCategories: dataCategories.sort((a, b) => a.code - b.code),
      }))),
      PersonalDataDC.registerDataItemsObserver(dataItems => this.setState(() => ({ dataItems }))),
      BorrowerDC.registerBorrowerAppsObserver(borrowerApps => this.setState(() => ({
        borrowerApps: borrowerApps.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
      }))),
    );
  }

  componentWillUnmount() {
    this.observerUnregisterers.forEach(unregister => unregister());
  }

  createFormModalVisibilityHandler = (modal: PersonalDataVCState['modal'], formMode?: PersonalDataVCState['formMode']) => (selectedDataCategoryCode?: number) => {
    typeof formMode !== 'undefined'
      ? this.setState(() => ({ formMode, modal, selectedDataCategoryCode }))
      : this.setState(() => ({ modal, selectedDataCategoryCode }));
  }

  handleModalClose = this.createFormModalVisibilityHandler(ModalState.CLOSED);

  handleDataCategorySubmission = async (formData: FormData, formMode: FormMode) => {
    const {
      code,
      category1,
      category2,
      category3,
      borrowerAppAddress,
      score,
      rewardCycle,
    } = formData;
    try {
      switch (formMode) {
        case FormMode.ADD:
          await PersonalDataDC.addDataCategory(Number(code), category1, category2, category3, borrowerAppAddress, Number(score), rewardCycle);
          break;
        case FormMode.EDIT:
          await PersonalDataDC.updateDataCategory(Number(code), category1, category2, category3, Number(score), rewardCycle);
          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e);
    }
    this.setState(() => ({ modal: ModalState.CLOSED }));
  }

  handleDataCategoryRemoval = async (code: PersonalDataCategory['code']) => {
    try {
      await PersonalDataDC.removeDataCategory(Number(code));
    } catch (e) {
      console.log(e);
    }
    this.setState(() => ({ modal: ModalState.CLOSED }));
  }

  render() {
    const { modal, formMode, dataCategories, borrowerApps, selectedDataCategoryCode } = this.state;
    const dataCategoryWithBorrowApps = dataCategoryWithBorrowAppsSelector(this.state);
    const dataCategoryByCodeWithDataItems = dataCategoryByCodeWithDataItemsSelector(this.state);
    const isLoading = !dataCategories || !dataCategories.length;
    const unremoveableCategory = dataCategoryByCodeWithDataItems[selectedDataCategoryCode]
      && dataCategoryByCodeWithDataItems[selectedDataCategoryCode].dataItems
      && dataCategoryByCodeWithDataItems[selectedDataCategoryCode].dataItems.length > 0;

    return (
      <Container>
        {isLoading
          ? <Loading />
          : (
            <Fragment>
              <RayonModalView narrow
                isModalOpen={modal === ModalState.FORM_OPEN}
                onRequestClose={this.handleModalClose}
              >
                {modal === ModalState.FORM_OPEN && <PersonalDataCategoryFormView
                  mode={formMode}
                  dataCategory={dataCategoryByCodeWithDataItems[selectedDataCategoryCode]}
                  borrowerApps={borrowerApps}
                  onDataCategorySubmitted={this.handleDataCategorySubmission}
                />}
              </RayonModalView>
              <ConfirmModalView narrow
                isModalOpen={modal === ModalState.CONFIRM_OPEN}
                onRequestClose={this.handleModalClose}
                confirmButtonTitle={!unremoveableCategory && 'Submit'}
                onConfirm={unremoveableCategory
                  ? this.handleModalClose
                  : this.handleDataCategoryRemoval.bind(null, selectedDataCategoryCode)}
                onCancel={!unremoveableCategory && this.handleModalClose || undefined}
              >
                {modal === ModalState.CONFIRM_OPEN && (
                  unremoveableCategory && (
                    <Fragment>
                      <h3>Can not remove personal data category ({selectedDataCategoryCode})</h3>
                      <p>Personal data referencing this category has already been registered</p>
                    </Fragment>
                  ) || (
                    <Fragment>
                      <h3>Remove personal data category ({selectedDataCategoryCode})</h3>
                    </Fragment>
                  )
                )}
              </ConfirmModalView>
              <PersonalDataCategoryTableView
                dataCategories={dataCategoryWithBorrowApps}
                onAddClick={this.createFormModalVisibilityHandler(ModalState.FORM_OPEN, FormMode.ADD)}
                onEditClick={this.createFormModalVisibilityHandler(ModalState.FORM_OPEN, FormMode.EDIT)}
                onRemoveClick={this.createFormModalVisibilityHandler(ModalState.CONFIRM_OPEN)}
              />
            </Fragment>
          )}
      </Container>
    );
  }
}

export default withRouter(PersonalDataVC);
