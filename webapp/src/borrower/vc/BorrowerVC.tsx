import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';

import { indexByKey, denormalize, IndexedEntities } from '../../common/util/entity';

// model
import { BorrowerApp, Borrower, BorrowerMember, BorrowerQueryKey } from '../../../../shared/borrower/model/Borrower';

// dc
import BorrowerDC from 'borrower/dc/BorrowerDC';

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

type BorrowerVCProps = RouteComponentProps<{}>;

interface BorrowerVCState {
  notifiedOnce: boolean;
  borrowerApps: BorrowerApp[];
  borrowers: Borrower[];
  borrowerAppEntities: IndexedEntities<BorrowerApp>;
  borrowerEntities: IndexedEntities<Borrower>;
  borrowerMemberEntities: IndexedEntities<BorrowerMember[]>;
  isFormModalOpen: boolean;
  openedFormMode: FormMode;
}

class BorrowerVC extends Component<BorrowerVCProps, BorrowerVCState> {
  constructor(props) {
    super(props);
    this.state = {
      notifiedOnce: false,
      borrowerApps: [] as BorrowerApp[],
      borrowerAppEntities: {} as IndexedEntities<BorrowerApp>,
      borrowers: [] as Borrower[],
      borrowerEntities: {} as IndexedEntities<Borrower>,
      borrowerMemberEntities: {} as IndexedEntities<BorrowerMember[]>,
      isFormModalOpen: false,
      openedFormMode: undefined,
    };
  }

  observerUnregisterers = [];

  componentDidMount() {
    this.observerUnregisterers.push(
      BorrowerDC.registerBorrowerAppsObserver(this.updateBorrowerApps),
      BorrowerDC.registerBorrowersObserver(this.updateBorrowers),
      BorrowerDC.registerBorrowerMembersObserver(this.updateBorrowerMembers),
    );
  }

  componentWillUnmount() {
    this.observerUnregisterers.forEach(unregister => unregister());
  }

  updateBorrowerApps = (borrowerApps: BorrowerApp[]) => this.setState(() => ({
    notifiedOnce: borrowerApps && borrowerApps.length > 0,
    borrowerApps,
    borrowerAppEntities: indexByKey(borrowerApps, entry => entry.address, true),
  }))

  updateBorrowers = (borrowers: Borrower[]) => this.setState(() => ({
    borrowers,
    borrowerEntities: indexByKey(borrowers, entity => entity.address, true),
  }))

  updateBorrowerMembers = (borrowerMembers: BorrowerMember[]) => this.setState(() => ({
    borrowerMemberEntities: indexByKey(borrowerMembers, entity => entity.borrowerAppAddress, false),
  }))

  getBorrowerAppWithMembers({ borrowerAppEntities, borrowerMemberEntities, borrowerEntities }: BorrowerVCState) {
    const indexedBorrowerMemberWithBorrower = denormalize(
      borrowerMemberEntities,
      entry => ({
        borrower: borrowerEntities[entry.borrowerAddress],
      }),
    );

    const indexedBorrowerAppWithMembers = denormalize(
      borrowerAppEntities,
      entry => ({
        members: indexedBorrowerMemberWithBorrower[entry.address],
      }),
    );

    return indexedBorrowerAppWithMembers;
  }

  getBorrowerAppAddressFromProps = (props: BorrowerVCProps, state: BorrowerVCState): string => {
    const query = queryString.parse(props.location.search);
    return query[BorrowerQueryKey.BORROEWR_APP_ADDRESS];
  }

  createFormModalVisibilityHandler = (visible: BorrowerVCState['isFormModalOpen'], formMode?: BorrowerVCState['openedFormMode']) => () => {
    typeof formMode !== 'undefined'
      ? this.setState(() => ({
        openedFormMode: formMode,
        isFormModalOpen: visible,
      }))
      : this.setState(() => ({ isFormModalOpen: visible }));
  }

  handleBorrowerAppSubmission = async (address: string, name: string, formMode: FormMode) => {
    try {
      formMode === FormMode.ADD
        ? await BorrowerDC.addBorrowerApp(address, name)
        : await BorrowerDC.updateBorrowerApp(address, name);
    } catch (e) {
      console.log(e);
    }
    this.setState(() => ({ isFormModalOpen: false }));
  }

  render() {
    const { notifiedOnce, borrowerApps, isFormModalOpen, openedFormMode } = this.state;
    const indexedBorrowerAppWithMembers = this.getBorrowerAppWithMembers(this.state);
    const sortedBorrowerApps = [...(borrowerApps || [])].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    const borrowerAppAddressQueryValue = this.getBorrowerAppAddressFromProps(this.props, this.state);
    const selectedBorrowerAppAddress = borrowerAppAddressQueryValue
      || sortedBorrowerApps[0] && sortedBorrowerApps[0].address
      || undefined;
    const borrowerAppWithMembers = indexedBorrowerAppWithMembers[selectedBorrowerAppAddress];

    return (
      <Container>
        {!notifiedOnce
          ? <Loading />
          : (
            <BorrowerContainer>
              <RayonModalView narrow isModalOpen={isFormModalOpen} onRequestClose={this.createFormModalVisibilityHandler(false)}>
                {isFormModalOpen && <BorrowerAppFormView
                  mode={openedFormMode}
                  borrowerApp={borrowerAppWithMembers}
                  onBorrowerAppSubmitted={this.handleBorrowerAppSubmission}
                />}
              </RayonModalView>
              <BorrowerSideBarView
                borrowerApps={sortedBorrowerApps}
                selectedBorrowerAppAddress={selectedBorrowerAppAddress}
                buttonElement={
                  <TextButton bordered onClick={this.createFormModalVisibilityHandler(true, FormMode.ADD)}>Add</TextButton>
                }
              />
              {borrowerAppWithMembers
                ? (
                  <BorrowerDetailContainer title={borrowerAppWithMembers.name} buttonElement={
                    <TextButton bordered onClick={this.createFormModalVisibilityHandler(true, FormMode.EDIT)}>Edit</TextButton>
                  }>
                    <BorrowerAppDetailView borrowerAppWithMembers={borrowerAppWithMembers} />
                    <BorrowerMemberTableView borrowerAppWithMembers={borrowerAppWithMembers} />
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
