// agent
import BorrowerContractAgent from 'borrower/agent/BorrowerContractAgent';

// model
import { BorrowerApp, Borrower, BorrowerMember } from '../../../../shared/borrower/model/Borrower';
import createObserverSubject from 'common/util/createObserverSubject';
import { ContractEventObject } from 'common/util/createEventSubscriber';
import attatchStoreToReducer from 'common/util/attatchStoreToReducer';
import AsyncInitiatable from 'common/util/AsyncInitiatable';

class BorrowerDC extends AsyncInitiatable {
  private store = new Map<'BORROWER_APPS' | 'BORROWERS' | 'BORROWER_MEMBERS', BorrowerApp[] | Borrower[] | BorrowerMember[]>([
    ['BORROWER_APPS', []],
    ['BORROWERS', []],
    ['BORROWER_MEMBERS', []],
  ]);

  protected async init() {
    await BorrowerContractAgent.initiation;
    BorrowerContractAgent.subscribeBorrowerAppEvent(
      attatchStoreToReducer(
        this.store, 'BORROWER_APPS',
        this.borrowerAppsReducer,
        this.borrowerAppsSubject.notify,
      ),
    );
    BorrowerContractAgent.subscribeBorrowerEvent(
      attatchStoreToReducer(
        this.store, 'BORROWERS',
        this.borrowersReducer,
        this.borrowersSubject.notify,
      ),
    );
    BorrowerContractAgent.subscribeBorrowerMemberEvent(
      attatchStoreToReducer(
        this.store, 'BORROWER_MEMBERS',
        this.borrowerMembersReducer,
        this.borrowerMembersSubject.notify,
      ),
    );

    this.fetchBorrowerApps();
    this.fetchBorrowerMembers();
    this.fetchBorrowers();
  }

  private borrowerAppsSubject = createObserverSubject<BorrowerApp[]>(
    () => this.store.get('BORROWER_APPS') as BorrowerApp[],
  );
  public registerBorrowerAppsObserver = this.borrowerAppsSubject.register;

  private borrowersSubject = createObserverSubject<Borrower[]>(
    () => this.store.get('BORROWERS') as Borrower[],
  );
  public registerBorrowersObserver = this.borrowersSubject.register;

  private borrowerMembersSubject = createObserverSubject<BorrowerMember[]>(
    () => this.store.get('BORROWER_MEMBERS') as BorrowerMember[],
  );
  public registerBorrowerMembersObserver = this.borrowerMembersSubject.register;

  private borrowerAppsReducer = async (prevBorrowerApps: BorrowerApp[], eventObject: ContractEventObject): Promise<BorrowerApp[]> => {
    const { event, returnValues: { id: address } } = eventObject;
    if (!address) return prevBorrowerApps;

    const borrowerApp = await BorrowerContractAgent.getBorrowerApp(address);
    switch (event) {
      case 'LogBorrowerAppAdded':
        return prevBorrowerApps.concat(borrowerApp);
      case 'LogBorrowerAppUpdated':
        return prevBorrowerApps.filter(b => b.address !== address).concat(borrowerApp);
      default:
        return prevBorrowerApps;
    }
  }

  private borrowersReducer = async (prevBorrowers: Borrower[], eventObject: ContractEventObject): Promise<Borrower[]> => {
    const { event, returnValues: { id: address } } = eventObject;
    if (!address) return prevBorrowers;

    const borrower = await BorrowerContractAgent.getBorrower(address);
    switch (event) {
      case 'LogBorrowerAdded':
        return prevBorrowers.concat(borrower);
      case 'LogBorrowerUpdated':
        return prevBorrowers.filter(b => b.address !== address).concat(borrower);
      default:
        return prevBorrowers;
    }
  }

  private borrowerMembersReducer = async (prevBorrowerMembers: BorrowerMember[], eventObject: ContractEventObject): Promise<BorrowerMember[]> => {
    const { event, returnValues: { borrowerAppId: borrowerAppAddress, borrowerId: borrowerAddress } } = eventObject;
    if (!borrowerAppAddress || borrowerAddress) return prevBorrowerMembers;
    const borrowerMember = await BorrowerContractAgent.getBorrowerMember(borrowerAppAddress, borrowerAddress);
    switch (event) {
      case 'LogBorrowerMemberJoined':
        return prevBorrowerMembers.concat(borrowerMember);
      case 'LogBorrowerMemberUnjoined':
        return prevBorrowerMembers.filter(m => m.borrowerAppAddress !== borrowerAppAddress && m.borrowerAddress !== borrowerAddress)
      default:
        return prevBorrowerMembers;
    }
  }

  public addBorrowerApp = BorrowerContractAgent.addBorrowerApp;

  public updateBorrowerApp = BorrowerContractAgent.updateBorrowerApp;

  public fetchBorrowerApps = async () => {
    const addresses = await BorrowerContractAgent.getBorrowerAppIds();
    const borrowerApps = await Promise.all(addresses.map(address => BorrowerContractAgent.getBorrowerApp(address)));
    this.store.set('BORROWER_APPS', borrowerApps);
    this.borrowerAppsSubject.notify(borrowerApps);
  }

  public fetchBorrowers = async () => {
    const addresses = await BorrowerContractAgent.getBorrowerIds();
    const borrowers = await Promise.all(addresses.map(address => BorrowerContractAgent.getBorrower(address)));
    this.store.set('BORROWERS', borrowers);
    this.borrowersSubject.notify(borrowers);
  }

  public fetchBorrowerMembers = async () => {
    const borrowerMembers = await BorrowerContractAgent.getBorrowerMembers();
    this.store.set('BORROWER_MEMBERS', borrowerMembers);
    this.borrowerMembersSubject.notify(borrowerMembers);
  }
}

export default new BorrowerDC();
