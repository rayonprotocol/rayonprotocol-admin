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
import { PersonalDataCategory } from '../../../../shared/personaldata/model/PerosnalData';
import PersonalDataCategoryTableView from 'personaldata/view/PersonalDataCategoryTableView';
import BorrowerDC from 'borrower/dc/BorrowerDC';

type PersonalDataVCProps = RouteComponentProps<{}>;

interface PersonalDataVCState {
  notifiedOnce: boolean;
  isFormModalOpen: boolean;
  dataCategories: PersonalDataCategory[];
  borrowerApps: BorrowerApp[];
  openedFormMode: FormMode;
  selectedDataCategoryCode: number;
}
const borrowerAppEntitiesSelector = ({ borrowerApps }: PersonalDataVCState) => indexByKey(borrowerApps, entity => entity.address, true);
const dataCategoryEntitiesSelector = ({ dataCategories }: PersonalDataVCState) => indexByKey(dataCategories, entity => entity.code, true); ;

const dataCategoryWithBorrowAppsSelector = createSelector(
  borrowerAppEntitiesSelector,
  ({ dataCategories }: PersonalDataVCState) => dataCategories,
  (borrowerAppEntities, dataCategories) => denormalize(
    dataCategories,
    entity => ({
      borrowerApp: borrowerAppEntities[entity.borrowerAppAddress],
    }),
  ));

class PersonalDataVC extends Component<PersonalDataVCProps, PersonalDataVCState> {
  constructor(props) {
    super(props);
    this.state = {
      notifiedOnce: false,
      isFormModalOpen: false,
      dataCategories: [],
      borrowerApps: [],
      openedFormMode: undefined,
      selectedDataCategoryCode: undefined,
    };
  }

  observerUnregisterers = [];

  componentDidMount() {
    this.observerUnregisterers.push(
      PersonalDataDC.registerDataCategoriesObserver(this.updateDataCategories),
      BorrowerDC.registerBorrowerAppsObserver(this.updateBorrowerApps),
    );
  }

  componentWillUnmount() {
    this.observerUnregisterers.forEach(unregister => unregister());
  }

  updateDataCategories = (dataCategories: PersonalDataCategory[]) => this.setState(() => ({
    notifiedOnce: dataCategories && dataCategories.length > 0,
    dataCategories: dataCategories.sort((a, b) => a.code - b.code),
  }))

  updateBorrowerApps = (borrowerApps: BorrowerApp[]) => this.setState(() => ({
    borrowerApps: borrowerApps.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
  }))

  createFormModalVisibilityHandler = (visible: PersonalDataVCState['isFormModalOpen'], formMode?: PersonalDataVCState['openedFormMode']) => (dataCategoryCode?: number) => {
    typeof formMode !== 'undefined'
      ? this.setState(() => ({
        openedFormMode: formMode,
        isFormModalOpen: visible,
        selectedDataCategoryCode: dataCategoryCode,
      }))
      : this.setState(() => ({
        isFormModalOpen: visible,
        selectedDataCategoryCode: dataCategoryCode,
      }));
  }

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
        case FormMode.REMOVE:
          await PersonalDataDC.removeDataCategory(Number(code));
        default:
          break;
      }
    } catch (e) {
      console.log(e);
    }
    this.setState(() => ({ isFormModalOpen: false }));
  }

  render() {
    const { notifiedOnce, isFormModalOpen, openedFormMode, borrowerApps, selectedDataCategoryCode } = this.state;
    const dataCategoryWithBorrowApps = dataCategoryWithBorrowAppsSelector(this.state);
    const dataCategoryEntities = dataCategoryEntitiesSelector(this.state);

    return (
      <Container>
        {!notifiedOnce
          ? <Loading />
          : (
            <Fragment>
              <RayonModalView narrow isModalOpen={isFormModalOpen} onRequestClose={this.createFormModalVisibilityHandler(false)}>
                {isFormModalOpen && <PersonalDataCategoryFormView
                  mode={openedFormMode}
                  dataCategory={dataCategoryEntities[selectedDataCategoryCode]}
                  borrowerApps={borrowerApps}
                  onDataCategorySubmitted={this.handleDataCategorySubmission}
                />}
              </RayonModalView>
              <PersonalDataCategoryTableView
                dataCategories={dataCategoryWithBorrowApps}
                onAddClick={this.createFormModalVisibilityHandler(true, FormMode.ADD)}
                onEditClick={this.createFormModalVisibilityHandler(true, FormMode.EDIT)}
                onRemoveClick={this.createFormModalVisibilityHandler(true, FormMode.REMOVE)}
              />
            </Fragment>
          )}
      </Container>
    );
  }
}

export default withRouter(PersonalDataVC);
