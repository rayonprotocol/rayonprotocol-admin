// agent
// import BorrowerAgent from 'token/agent/BorrowerAgent';

// model
import { BorrowerApp, Borrower, BorrowerMember } from '../../../../shared/borrower/model/Borrower';
import moment from 'moment';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms*10));

let borrowerApps: BorrowerApp[] = [
  // hd path index 4
  {
    name: 'Finda',
    address: '0xef1121ac4cd5825436A666b6983B4f0d4984e7E0',
    updatedEpochTime: 1541480839,
    updatedDate: moment.unix(1541480839).format('YYYY-MM-DD'),
  },
  // hd path index 5
  {
    name: 'Other Borrower App',
    address: '0x7D81B073D86C316C700c2c7243Ed1D6872573680',
    updatedEpochTime: 1541480839,
    updatedDate: moment.unix(1541480839).format('YYYY-MM-DD'),
  },
  // hd path index 6
  {
    name: 'XX Borrower App',
    address: '0x8d43E6371BdC26e0d93Eb7B3f125F780f21Bf27D',
    updatedEpochTime: 1541480839,
    updatedDate: moment.unix(1541480839).format('YYYY-MM-DD'),
  }
]

let borrowers: Borrower[] = [
  // hd path index 1
  {
    name: 'first borrower',
    address: '0x657B63104bC74Dfc24E9c9e631BEB07A2a3B2f9c',
    updatedEpochTime: 1541482839,
    updatedDate: moment.unix(1541482839).format('YYYY-MM-DD'),
  },
  // hd path index 2
  {
    name: 'second borrower',
    address: '0xfa2eC2Fd84E06Ac5871DB3e84B7B4037457F3500',
    updatedEpochTime: 1541482839,
    updatedDate: moment.unix(1541482839).format('YYYY-MM-DD'),
  },
  // hd path index 3
  {
    name: 'third borrower',
    address: '0x84ac9F697b7C998C192321F838B80d20B5f9B06B',
    updatedEpochTime: 1541582839,
    updatedDate: moment.unix(1541582839).format('YYYY-MM-DD'),
  },
];

let borrowerMembers: BorrowerMember[] = [
  {
    borrowerAppAddress: '0xef1121ac4cd5825436A666b6983B4f0d4984e7E0',
    borrowerAddress: '0x657B63104bC74Dfc24E9c9e631BEB07A2a3B2f9c',
    joinedEpochTime: 1541483839,
    joinedDate: moment.unix(1541483839).format('YYYY-MM-DD'),
  },
  {
    borrowerAppAddress: '0x7D81B073D86C316C700c2c7243Ed1D6872573680',
    borrowerAddress: '0xfa2eC2Fd84E06Ac5871DB3e84B7B4037457F3500',
    joinedEpochTime: 1541493839,
    joinedDate: moment.unix(1541493839).format('YYYY-MM-DD'),
  },
  {
    borrowerAppAddress: '0x7D81B073D86C316C700c2c7243Ed1D6872573680',
    borrowerAddress: '0x84ac9F697b7C998C192321F838B80d20B5f9B06B',
    joinedEpochTime: 1541593899,
    joinedDate: moment.unix(1541593899).format('YYYY-MM-DD'),
  },
];

const getBorrowerAppIds = async () => {
  await delay(2500);
  return borrowerApps.map(borrowerApp => borrowerApp.address)
};

const getBorrowerApp = async (borrowerAppAddress: string) => {
  await delay(2500);
  return borrowerApps.find(borrowerApp => borrowerApp.address === borrowerAppAddress);
};

const getBorrowerIds = async () => {
  await delay(2500);
  return borrowers.map(borrower => borrower.address)
};

const getBorrower = async (borrowerId: string) => {
  await delay(2500);
  return borrowers.find(borrower => borrower.address === borrowerId);
};

// smaratcontract 구현해야함
const getBorrowerMemberCount = async () => {
  await delay(500);
  return borrowerMembers.length;
}
// smaratcontract 구현해야함
const getBorrowerMemberByIndex = async (index: number) => {
  await delay(700);
  const m = borrowerMembers[index];
  return [m.borrowerAppAddress, m.borrowerAddress];
}

const getBorrowerMember = async (borrowerAppAddress: string, borrowerAddress: string) => {
  return borrowerMembers
    .find(borrowerMember =>
      borrowerMember.borrowerAppAddress === borrowerAppAddress
      && borrowerMember.borrowerAddress === borrowerAddress
    ).joinedEpochTime;
}


function createObserverSubject<T>(initialValueGetter: (...args: any[]) => T) {
  const observers = new Set<(data: T) => void>();

  const notify = (data?: T) => {
    Array.from(observers).forEach(ob => ob(data || initialValueGetter && initialValueGetter() || undefined));
  };

  const register = (observer: (data: T) => void, willNotImediatelyNofify?: boolean) => {
    if (observers.has(observer)) return;
    observers.add(observer);

    const unregister = () => {
      if (!observers.has(observer)) return;
      observers.delete(observer);
    };

    if (!willNotImediatelyNofify) notify();
    return unregister;
  };

  return { notify, register };
}

class BorrowerDC {

  async fetchBorrowerApps() {
    await delay(1500);
    const addresses = await getBorrowerAppIds();
    const borrowerApps = await Promise.all(addresses.map(address => getBorrowerApp(address)));
    this.borrowerAppsSubject.notify(borrowerApps);
  }

  async fetchBorrowers() {
    await delay(500);
    const addresses = await getBorrowerIds();
    const borrowers = await Promise.all(addresses.map(address => getBorrower(address)));
    this.borrowersSubject.notify(borrowers);
  }

  async fetchBorrowerMembers() {
    await delay(500);
    const count = await getBorrowerMemberCount();

    const addressPairs = await Promise.all(
      [...Array(count)].map((_, index) => getBorrowerMemberByIndex(index))
    );
    const joinedEpochTimes = await Promise.all(
      addressPairs.map(([borrowerAppAddress, borrowerAddress]) => getBorrowerMember(borrowerAppAddress, borrowerAddress))
    );

    const borrowerMembers: BorrowerMember[] = addressPairs.map(([borrowerAppAddress, borrowerAddress], index) => ({
      borrowerAppAddress,
      borrowerAddress,
      joinedEpochTime: joinedEpochTimes[index],
      joinedDate: moment.unix(joinedEpochTimes[index]).format('YYYY-MM-DD'),
    }));

    this.borrowerMembersSubject.notify(borrowerMembers);
  }

  constructor() {
    this.fetchBorrowerApps();
    this.fetchBorrowers();
    this.fetchBorrowerMembers();
  }

  private borrowerAppsSubject = createObserverSubject<BorrowerApp[]>(() => borrowerApps);
  public registerBorrowerAppsObserver = this.borrowerAppsSubject.register;

  private borrowersSubject = createObserverSubject<Borrower[]>(() => borrowers);
  public registerBorrowersObserver = this.borrowersSubject.register;

  private borrowerMembersSubject = createObserverSubject<BorrowerMember[]>(() => borrowerMembers);
  public registerBorrowerMembersObserver = this.borrowerMembersSubject.register;


  // DC method candidates
  async getData() {
    // 등록되어있는 모든 borrower app을 가져옴
    // borrower app에 해당하는 정보를 가저옴

    // borrower app에 속해있는 borrower의 정보를 가져옴
  }

  async addData() {
    // 새 borrower app을 추가 (이름, 주소)
  }

  async updateData() {
    // 기존 borrower app을 갱신 (이름, 주소)
  }
}

export default new BorrowerDC();
