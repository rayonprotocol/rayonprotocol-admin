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

export interface BorrowerAppWithMembers extends BorrowerApp {
  members: MemberWithBorrower[];
}

export interface MemberWithBorrower extends BorrowerMember {
  borrower: Borrower;
}

export enum BorrowerQueryKey {
  BORROEWR_APP_ADDRESS = 'baa',
}