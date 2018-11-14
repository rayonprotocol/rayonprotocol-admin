// agent
// import BorrowerAgent from 'token/agent/BorrowerAgent';

// model
import { BorrowerApp, Borrower, BorrowerMember } from '../../../../shared/borrower/model/Borrower';
import BorrowerContractAgent from 'borrower/agent/BorrowerContractAgent';
import createObserverSubject from 'common/util/createObserverSubject';

class BorrowerDC {
  private cache = new Map<'BORROWERS' | 'BORROWER_APPS' | 'BORROWER_MEMBERS', Borrower[] | Borrower[] | BorrowerMember[]>();

  public fetchBorrowerApps = async () => {
    const addresses = await BorrowerContractAgent.getBorrowerAppIds();
    const borrowerApps = await Promise.all(addresses.map(address => BorrowerContractAgent.getBorrowerApp(address)));
    this.cache.set('BORROWER_APPS', borrowerApps);
    this.borrowerAppsSubject.notify(borrowerApps);
    this.registerBorrowerAppsObserver(this.fetchBorrowerMembers);
    this.registerBorrowerMembersObserver(this.fetchBorrowers);
  }

  public fetchBorrowers = async () => {
    const addresses = await BorrowerContractAgent.getBorrowerIds();
    const borrowers = await Promise.all(addresses.map(address => BorrowerContractAgent.getBorrower(address)));
    this.cache.set('BORROWERS', borrowers);
    this.borrowersSubject.notify(borrowers);
  }

  public fetchBorrowerMembers = async (borrowerApps: BorrowerApp[]) => {
    const membersForBorrowerApps = await Promise.all(borrowerApps.map(borrowerApp => BorrowerContractAgent.getBorrowerMembers(borrowerApp.address)));
    const borrowerMembers = membersForBorrowerApps.reduce((flatten, membersForBorrowerApp) => {
      return membersForBorrowerApp
        ? [...flatten, ...membersForBorrowerApp]
        : flatten;
    }, []);
    this.cache.set('BORROWER_MEMBERS', borrowerMembers);
    this.borrowerMembersSubject.notify(borrowerMembers);
  }

  private borrowerAppsSubject = createObserverSubject<BorrowerApp[]>(
    () => this.cache.get('BORROWER_APPS') as BorrowerApp[] || [],
  );
  public registerBorrowerAppsObserver = this.borrowerAppsSubject.register;

  private borrowersSubject = createObserverSubject<Borrower[]>(
    () => this.cache.get('BORROWERS') as Borrower[] || [],
  );
  public registerBorrowersObserver = this.borrowersSubject.register;

  private borrowerMembersSubject = createObserverSubject<BorrowerMember[]>(
    () => this.cache.get('BORROWER_MEMBERS') as BorrowerMember[] || [],
  );
  public registerBorrowerMembersObserver = this.borrowerMembersSubject.register;

  async addData() {
    // 새 borrower app을 추가 (이름, 주소)
  }

  async updateData() {
    // 기존 borrower app을 갱신 (이름, 주소)
  }
}

export default new BorrowerDC();
