import React, { Component } from 'react';
import { createSelector } from 'reselect';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';

import { indexByKey, denormalize } from '../../common/util/entity';

// model
import { BorrowerApp, Borrower, BorrowerMember, BorrowerQueryKey } from '../../../../shared/borrower/model/Borrower';
import { PersonalDataItem, PersonalDataCategory } from '../../../../shared/personaldata/model/PerosnalData';

// dc
import BorrowerDC from 'borrower/dc/BorrowerDC';
import PersonalDataDC from 'personaldata/dc/PersonalDataDC';

// view
import Loading from 'common/view/loading/Loading';
import Container from 'common/view/container/Container';
import BorrowerSideBarView from 'borrower/view/BorrowerSideBarView';
import BorrowerContainer from 'borrower/view/BorrowerContainer';
import BorrowerDetailContainer from 'borrower/view/BorrowerDetailContainer';
import BorrowerAppDetailView from 'borrower/view/BorrowerAppDetailView';
import BorrowerMemberTableView from 'borrower/view/BorrowerMemberTableView';
import RayonModalView from 'common/view/modal/RayonModalView';
import BorrowerAppFormView, { FormMode } from 'borrower/view/BorrowerAppFormView';
import { TextButton } from 'common/view/button/TextButtons';
import BorrowerDataItemTableView from 'borrower/view/BorrowerDataItemTableView';

type BorrowerVCProps = RouteComponentProps<{}>;

enum ModalState {
  CLOSED,
  FORM_OPEN,
  TABLE_OPEN,
}

interface BorrowerVCState {
  borrowerApps: BorrowerApp[];
  borrowers: Borrower[];
  borrowerMembers: BorrowerMember[];
  dataItems: PersonalDataItem[];
  dataCategories: PersonalDataCategory[];
  selectedBorrowerAppAddress: BorrowerApp['address'];
  selectedBorrowerAddress: Borrower['address'];
  modal: ModalState;
  formMode: FormMode;
}

const borrowerAppEntitiesSelector = ({ borrowerApps }: BorrowerVCState) => indexByKey(borrowerApps, entity => entity.address, true);
const borrowerEntitiesSelector = ({ borrowers }: BorrowerVCState) => indexByKey(borrowers, entity => entity.address, true);
const borrowerMemberEntitiesSelector = ({ borrowerMembers }: BorrowerVCState) => indexByKey(borrowerMembers, entity => entity.borrowerAppAddress, false);
const dataItemEntitiesSelector = ({ dataItems }: BorrowerVCState) => indexByKey(dataItems, entity => entity.borrowerAddress, false);
const dataCategoryEntitiesSelector = ({ dataCategories }: BorrowerVCState) => indexByKey(dataCategories, entity => entity.code, true);

const dataItemWithCategorySelector = createSelector(
  dataItemEntitiesSelector,
  dataCategoryEntitiesSelector,
  (dataItemEntities, dataCategoryEntities) => denormalize(
    dataItemEntities,
    entity => ({
      category: dataCategoryEntities[entity.code],
    }),
  ),
);

const borrowerWithDataItemsSelector = createSelector(
  borrowerEntitiesSelector,
  dataItemWithCategorySelector,
  (borrowerEntities, dataItemWithCategoryEntities) => denormalize(
    borrowerEntities,
    entity => ({
      dataItems: dataItemWithCategoryEntities[entity.address],
    }),
  ),
);

const borrowerMemberWithBorrowerSelector = createSelector(
  borrowerMemberEntitiesSelector,
  borrowerWithDataItemsSelector,
  (borrowerMemberEntities, borrowerWithDataItemsEntities) => denormalize(
    borrowerMemberEntities,
    entity => ({
      borrower: borrowerWithDataItemsEntities[entity.borrowerAddress],
    }),
  ));

const borrowerAppWithMembersSelector = createSelector(
  borrowerAppEntitiesSelector,
  borrowerMemberWithBorrowerSelector,
  (borrowerAppEntities, borrowerMemberWithBorrowerEntities) => denormalize(
    borrowerAppEntities,
    entity => ({
      members: borrowerMemberWithBorrowerEntities[entity.address],
    }),
  ));

class BorrowerVC extends Component<BorrowerVCProps, BorrowerVCState> {
  static getDerivedStateFromProps = (props: BorrowerVCProps, state: BorrowerVCState): BorrowerVCState => {
    const { location } = props;
    const { borrowerApps } = state;
    const query = queryString.parse(location.search);
    const borrowerAppAddressQueryValue = query[BorrowerQueryKey.BORROEWR_APP_ADDRESS];
    const selectedBorrowerAppAddress = borrowerAppAddressQueryValue
      || borrowerApps[0] && borrowerApps[0].address
      || undefined;
    return { ...state, selectedBorrowerAppAddress };
  }

  constructor(props) {
    super(props);
    this.state = {
      borrowerApps: [],
      borrowers: [],
      borrowerMembers: [],
      dataItems: [],
      dataCategories: [],
      selectedBorrowerAppAddress: undefined,
      selectedBorrowerAddress: undefined,
      modal: ModalState.CLOSED,
      formMode: undefined,
    };
  }

  observerUnregisterers = [];

  async componentDidMount() {
    await Promise.all([BorrowerDC.initiation, PersonalDataDC.initiation]);
    this.observerUnregisterers.push(
      BorrowerDC.registerBorrowerAppsObserver(borrowerApps => this.setState(() => ({
        borrowerApps: borrowerApps.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
      }))),
      BorrowerDC.registerBorrowersObserver(borrowers => this.setState(() => ({ borrowers }))),
      BorrowerDC.registerBorrowerMembersObserver(borrowerMembers => this.setState(() => ({ borrowerMembers }))),
      PersonalDataDC.registerDataItemsObserver(dataItems => this.setState(() => ({ dataItems }))),
      PersonalDataDC.registerDataCategoriesObserver(dataCategories => this.setState(() => ({ dataCategories }))),
    );
  }

  componentWillUnmount() {
    this.observerUnregisterers.forEach(unregister => unregister());
  }

  createFormModalVisibilityHandler = (modal: BorrowerVCState['modal'], formMode?: BorrowerVCState['formMode']) => () => {
    typeof formMode !== 'undefined'
      ? this.setState(() => ({ formMode, modal }))
      : this.setState(() => ({ modal: ModalState.CLOSED }));
  }

  createTableModalVisibilityHandler = (modal: BorrowerVCState['modal']) => (selectedBorrowerAddress: Borrower['address']) => {
    typeof selectedBorrowerAddress !== 'undefined'
      ? this.setState(() => ({ modal, selectedBorrowerAddress }))
      : this.setState(() => ({ modal: ModalState.CLOSED }));
  }

  handleBorrowerAppSubmission = async (address: string, name: string, formMode: FormMode) => {
    try {
      formMode === FormMode.ADD
        ? await BorrowerDC.addBorrowerApp(address, name)
        : await BorrowerDC.updateBorrowerApp(address, name);
    } catch (e) {
      console.log(e);
    }
    this.setState(() => ({ modal: ModalState.CLOSED }));
  }

  render() {
    const {
      borrowerApps, selectedBorrowerAppAddress, selectedBorrowerAddress,
      modal, formMode,
    } = this.state;
    const isLoading = !borrowerApps || !borrowerApps.length;
    const indexedBorrowerWithDataItem = borrowerWithDataItemsSelector(this.state);
    const indexedBorrowerAppWithMembers = borrowerAppWithMembersSelector(this.state);
    const borrowerAppWithMembers = indexedBorrowerAppWithMembers[selectedBorrowerAppAddress];
    const borrowerWithDataItems = indexedBorrowerWithDataItem[selectedBorrowerAddress];

    return (
      <Container>
        {isLoading
          ? <Loading />
          : (
            <BorrowerContainer>
              <RayonModalView narrow
                isModalOpen={modal === ModalState.FORM_OPEN}
                onRequestClose={this.createFormModalVisibilityHandler(ModalState.CLOSED)}
              >
                {modal === ModalState.FORM_OPEN && <BorrowerAppFormView
                  mode={formMode}
                  borrowerApp={borrowerAppWithMembers}
                  onBorrowerAppSubmitted={this.handleBorrowerAppSubmission}
                />}
              </RayonModalView>
              <RayonModalView wide
                isModalOpen={modal === ModalState.TABLE_OPEN}
                onRequestClose={this.createTableModalVisibilityHandler(ModalState.CLOSED)}
              >
                {modal === ModalState.TABLE_OPEN && <BorrowerDataItemTableView
                  borrower={borrowerWithDataItems}
                />}
              </RayonModalView>
              <BorrowerSideBarView
                borrowerApps={borrowerApps}
                selectedBorrowerAppAddress={selectedBorrowerAppAddress}
                buttonElement={
                  <TextButton bordered onClick={this.createFormModalVisibilityHandler(ModalState.FORM_OPEN, FormMode.ADD)}>Add New Borrower App</TextButton>
                }
              />
              {borrowerAppWithMembers
                ? (
                  <BorrowerDetailContainer title={borrowerAppWithMembers.name} buttonElement={
                    <TextButton bordered onClick={this.createFormModalVisibilityHandler(ModalState.FORM_OPEN, FormMode.EDIT)}>Edit</TextButton>
                  }>
                    <BorrowerAppDetailView borrowerAppWithMembers={borrowerAppWithMembers} />
                    <BorrowerMemberTableView borrowerAppWithMembers={borrowerAppWithMembers} onPersonalDataClick={this.createTableModalVisibilityHandler(ModalState.TABLE_OPEN)} />
                  </BorrowerDetailContainer>
                )
                : (
                  <BorrowerDetailContainer title={'No borrower app found'}></BorrowerDetailContainer>
                )}

            </BorrowerContainer>
          )
        }
      </Container>
    );
  }
}

export default withRouter(BorrowerVC);
