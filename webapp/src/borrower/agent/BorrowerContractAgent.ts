import moment from 'moment';
import Web3Controller from 'common/dc/Web3Controller';
import txResultToArr from 'common/util/txResultToArr';
import { BorrowerApp, Borrower, BorrowerMember } from '../../../../shared/borrower/model/Borrower';

const artifacts = {
  Borrower: require('../../../../dev/contract/.volume/borrower/Borrower.json'),
  BorrowerApp: require('../../../../dev/contract/.volume/borrower/BorrowerApp.json'),
  BorrowerMember: require('../../../../dev/contract/.volume/borrower/BorrowerMember.json'),
};

class BorrowerContractAgent {
  static getInstance = artifact => {
    return new (Web3Controller.getWeb3()).eth.Contract(artifact.abi, artifact.networks['9999'].address);
  }

  public borrower = BorrowerContractAgent.getInstance(artifacts.Borrower);
  public borrowerApp = BorrowerContractAgent.getInstance(artifacts.BorrowerApp);
  public borrowerMember = BorrowerContractAgent.getInstance(artifacts.BorrowerMember);

  public getBorrowerAppIds = async (): Promise<Array<BorrowerApp['address']>> => {
    const ids: string[] = await this.borrowerApp.methods.getIds().call();
    return ids;
  }

  public getBorrowerApp = async (borrowerAppAddress: string): Promise<BorrowerApp> => {
    const result = await this.borrowerApp.methods.get(borrowerAppAddress).call();
    const [address, name, updatedEpochTime] = txResultToArr(result);
    const borrowerApp: BorrowerApp = {
      address, name, updatedEpochTime,
      updatedDate: updatedEpochTime && moment.unix(updatedEpochTime).format('YYYY-MM-DD') || undefined,
    };
    return borrowerApp;
  }

  public getBorrowerIds = async () => {
    const ids: string[] = await this.borrower.methods.getIds().call();
    return ids;
  }

  public getBorrower = async (borrowerId: string): Promise<Borrower> => {
    const result = await this.borrower.methods.get(borrowerId).call();
    const [address, updatedEpochTime] = txResultToArr(result);
    return {
      address, updatedEpochTime,
      updatedDate: updatedEpochTime && moment.unix(updatedEpochTime).format('YYYY-MM-DD') || undefined,
    };
  }

  public getBorrowerMemberCount = async (borrowerAppAddress: string): Promise<number> => {
    const joinedBorrowerCount = await this.borrowerMember.methods.getJoinedBorrowerCount(borrowerAppAddress).call();
    return !isNaN(joinedBorrowerCount) && Number(joinedBorrowerCount) || 0;
  }

  public getBorrowerMemberByIndex = async (borrowerAppAddress: string, index: number): Promise<Borrower['address']> => {
    const borrowerAddress = await this.borrowerMember.methods.getJoinedBorrowerId(borrowerAppAddress, index).call();
    return borrowerAddress;
  }

  public getBorrowerMemberJoinedEpochTime = async (borrowerAppAddress: string, borrowerAddress: string): Promise<BorrowerMember['joinedEpochTime']> => {
    const joinedEpochTime = await this.borrowerMember.methods.getBorrowerMember(borrowerAppAddress, borrowerAddress).call();
    return Number(joinedEpochTime);
  }

  public getBorrowerMembers = async (borrowerAppAddress: string): Promise<BorrowerMember[]> => {
    const count = await this.getBorrowerMemberCount(borrowerAppAddress);
    if (!count) return [];

    const borrowerAddresses = await Promise.all(
      [...Array(count)].map((_, index) => {
        return this.getBorrowerMemberByIndex(borrowerAppAddress, index)
      }),
    );

    const joinedEpochTimes = await Promise.all(
      borrowerAddresses.map(borrowerAddress => this.getBorrowerMemberJoinedEpochTime(borrowerAppAddress, borrowerAddress))
    );

    const borrowerMembers: BorrowerMember[] = borrowerAddresses.map((borrowerAddress, index) => ({
      borrowerAppAddress,
      borrowerAddress,
      joinedEpochTime: joinedEpochTimes[index],
      joinedDate: moment.unix(joinedEpochTimes[index]).format('YYYY-MM-DD'),
    }));

    return borrowerMembers;
  }

}

export default new BorrowerContractAgent();

