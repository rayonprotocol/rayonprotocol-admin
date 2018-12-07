import { txResultToArr, mapDateProp } from 'common/util/txResult';
import { BorrowerApp, Borrower, BorrowerMember } from '../../../../shared/borrower/model/Borrower';
import createEventSubscriber, { EventSubscriber, ContractEventObject } from 'common/util/createEventSubscriber';
import { Contract } from 'web3/types';
import RayonContractAgent from 'common/agent/RayonContractAgent';

const artifacts = {
  Borrower: require('../../../../dev/contract/.volume/borrower/Borrower.json'),
  BorrowerApp: require('../../../../dev/contract/.volume/borrower/BorrowerApp.json'),
  BorrowerMember: require('../../../../dev/contract/.volume/borrower/BorrowerMember.json'),
};

class BorrowerContractAgent extends RayonContractAgent {

  private borrower: Contract;
  private borrowerApp: Contract;
  private borrowerMember: Contract;
  public subscribeBorrowerAppEvent: EventSubscriber<ContractEventObject>;
  public subscribeBorrowerEvent: EventSubscriber<ContractEventObject>;
  public subscribeBorrowerMemberEvent: EventSubscriber<ContractEventObject>;

  async init() {
    const [borrower, borrowerApp, borrowerMember] = await Promise.all([
      BorrowerContractAgent.getInstance(artifacts.Borrower),
      BorrowerContractAgent.getInstance(artifacts.BorrowerApp),
      BorrowerContractAgent.getInstance(artifacts.BorrowerMember)
    ]);

    this.borrower = borrower;
    this.borrowerApp = borrowerApp;
    this.borrowerMember = borrowerMember;
    this.subscribeBorrowerAppEvent = createEventSubscriber(this.borrowerApp);
    this.subscribeBorrowerEvent = createEventSubscriber(this.borrower);
    this.subscribeBorrowerMemberEvent = createEventSubscriber(this.borrowerMember);
  }

  public getBorrowerAppIds = async (): Promise<Array<BorrowerApp['address']>> => {
    const ids: string[] = await this.borrowerApp.methods.getIds().call();
    return ids || [];
  }

  public getBorrowerApp = async (borrowerAppAddress: string): Promise<BorrowerApp> => {
    const result = await this.borrowerApp.methods.get(borrowerAppAddress).call();
    const [address, name, updatedEpochTime] = txResultToArr(result);
    const borrowerApp: BorrowerApp = mapDateProp('updatedEpochTime', 'updatedDate')({
      address, name, updatedEpochTime,
    });
    return borrowerApp;
  }

  public getBorrowerIds = async () => {
    const ids: string[] = await this.borrower.methods.getIds().call();
    return ids || [];
  }

  public getBorrower = async (borrowerId: string): Promise<Borrower> => {
    const result = await this.borrower.methods.get(borrowerId).call();
    const [address, updatedEpochTime] = txResultToArr(result);
    return mapDateProp('updatedEpochTime', 'updatedDate')({
      address,
      updatedEpochTime,
    });
  }

  public getBorrowerMemberCount = async (borrowerAppAddress: string): Promise<number> => {
    const joinedBorrowerCount = await this.borrowerMember.methods.getJoinedBorrowerCount(borrowerAppAddress).call();
    return !isNaN(joinedBorrowerCount) && Number(joinedBorrowerCount) || 0;
  }

  public getBorrowerMemberByIndex = async (borrowerAppAddress: string, index: number): Promise<BorrowerMember> => {
    const borrowerAddress = await this.borrowerMember.methods.getJoinedBorrowerId(borrowerAppAddress, index).call();
    return this.getBorrowerMember(borrowerAppAddress, borrowerAddress);
  }

  public getBorrowerMember = async (borrowerAppAddress: string, borrowerAddress: string): Promise<BorrowerMember> => {
    const joinedEpochTime = await this.borrowerMember.methods.getBorrowerMember(borrowerAppAddress, borrowerAddress).call();
    return mapDateProp('joinedEpochTime', 'joinedDate')({
      borrowerAppAddress,
      borrowerAddress,
      joinedEpochTime,
    });
  }

  public getBorrowerAppMembers = async (borrowerAppAddress: string): Promise<BorrowerMember[]> => {
    const count = await this.getBorrowerMemberCount(borrowerAppAddress);
    if (!count) return [];
    const borrowerMembers = await Promise.all(
      [...Array(count)].map((_, index) => this.getBorrowerMemberByIndex(borrowerAppAddress, index)),
    );
    return borrowerMembers;
  }

  public getBorrowerMembers = async (): Promise<BorrowerMember[]> => {
    const countRaw = await this.borrowerMember.methods.getJoinedTotalCount().call();
    const count = !isNaN(countRaw) ? Number(countRaw) : 0;
    if (!count) return [];

    const rawBorrowerMembers = await Promise.all(
      [...Array(count)].map((_, index) => this.borrowerMember.methods.getBorrowerMemberByIndex(index).call()),
    );

    const borrowerMembers: BorrowerMember[] = rawBorrowerMembers.map(txResultToArr).map(([borrowerAddress, borrowerAppAddress, joinedEpochTime]) =>
      mapDateProp('joinedEpochTime', 'joinedDate')({
        borrowerAppAddress,
        borrowerAddress,
        joinedEpochTime,
      }),
    );

    return borrowerMembers;
  }

  public addBorrowerApp = async (address: string, name: string) => {
    await this.borrowerApp.methods.add(address, name).send({ from: '0xFecF01A4f52Cb911C02FF656c8Cb4BbD91a8eaf6' });
  }
  public updateBorrowerApp = async (address: string, name: string) => {
    await this.borrowerApp.methods.update(address, name).send({ from: '0xFecF01A4f52Cb911C02FF656c8Cb4BbD91a8eaf6' });
  }

}

export default new BorrowerContractAgent();
