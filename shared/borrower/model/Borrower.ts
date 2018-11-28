import { PersonalDataItem, PersonalDataCategory, PersonalDataItemWithCategory } from '../../personaldata/model/PerosnalData'

export interface Borrower {
  address: string;
  updatedEpochTime: number;
  updatedDate: string;
}

export interface BorrowerApp {
  name: string;
  address: string;
  updatedEpochTime: number;
  updatedDate: string;
}

export interface BorrowerMember {
  borrowerAppAddress: string;
  borrowerAddress: string;
  joinedEpochTime: number;
  joinedDate: string;
}


export enum BorrowerQueryKey {
  BORROEWR_APP_ADDRESS = 'ba',
}

// Derived models

export interface BorrowerAppWithMembers extends BorrowerApp {
  members: MemberWithBorrower[];
}

export interface MemberWithBorrower extends BorrowerMember {
  borrower: BorrowerWithDataItems;
}

export interface BorrowerWithDataItems extends Borrower {
  dataItems: PersonalDataItemWithCategory[];
}
