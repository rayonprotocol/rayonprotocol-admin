import Transaction, { Holder } from 'transaction/model/Transaction';

class TransactionDC {
  transactions: Transaction[];
  holders: Holder[];

  constructor() {
    this.transactions = [
      {
        txHash: '0x3d55d3bfb208bd83a0564a1084640953db20a6150ae39f0d7e0f647c068af0e7',
        block: 0,
        timestamp: 11111111,
        from: '0xba0921db7c29af184c57241ca0044f912119b4d1',
        to: ' 0xa62142888aba8370742be823c1782d17a0389da1',
        value: 100,
      },
      {
        txHash: '0x7ac75087a08dac024175830900baa41813682b18179b747de402ac106bab8953',
        block: 1,
        timestamp: 11111111,
        from: '0xee80b22f578aaa5f754a924ccf8bef8a410fa110',
        to: '0xb3775fb83f7d12a36e0475abdd1fca35c091efbe',
        value: 2300,
      },
      {
        txHash: '0xb39ced66e2ff165d2c6099079ec0fedf0df0f54963cdd68f5f7ff6d2e642f976',
        block: 2,
        timestamp: 11111111,
        from: '0xc8d8cd459366bc60bd3562617c4b80231efb6a84',
        to: '0x2f102963f61acf1ca4badfe82057b440f2fc722c',
        value: 4000,
      },
      {
        txHash: '0xee073759afde54e7e7492a0d51dbd9bc2cf832e1518f14d2023dc239275b5bf3',
        block: 3,
        timestamp: 11111111,
        from: '0xed0551db7d735f2948aa0af0240b1683bfedefb3',
        to: '0x578c7557d207e87e8232cd69d94f41a9a136a5fe ',
        value: 56,
      },
      {
        txHash: '0xf2fc22a9a45525ccc51c09b8f67a2ed1b6624107cde724d72ba23f6e4da52692',
        block: 4,
        timestamp: 11111111,
        from: '0x324cc2c9fb379ea7a0d1c0862c3b48ca28d174a4',
        to: '0xd88a564c49dfc0d37aa77826cae4906878a648e60xd',
        value: 780,
      },
    ];
    this.holders = [
      {
        address: '	0x50e4b7bd7ba43805a4f0519d6078f458dbbc0c83',
        quantity: 177090565,
        percentage: 44.2473,
      },
      {
        address: '	0x96f29e5fa055ad1ecc3322306598aa8fae21e49f',
        quantity: 17977639,
        percentage: 4.4918,
      },
      {
        address: '0x9f6b2d04be5d08782b1faf19e3a68c645ef4c634',
        quantity: 14633310,
        percentage: 3.6562,
      },
      {
        address: '0x0000000000000000000000000000000000000000',
        quantity: 13617304,
        percentage: 3.4024,
      },
      {
        address: '0x0da6638413d9996dbb741ab7af81e74ddbf84feb',
        quantity: 7500000,
        percentage: 1.8739,
      },
      {
        address: '0xdfcb08293f38cce13d15a585a6d8d47091189f33',
        quantity: 6250000,
        percentage: 1.5616,
      },
      {
        address: '0x636ed676dd35d08ed6f38caa32b61b5921a10e92',
        quantity: 6250000,
        percentage: 1.5616,
      },
      {
        address: '0xd1f360149a0604cc5c9f64627cd66b14a36b777d',
        quantity: 6250000,
        percentage: 1.5616,
      },
      {
        address: '0xc0fc878d439def8bbad1723e9c4b76387d33ffa5',
        quantity: 5750000,
        percentage: 1.4367,
      },
      {
        address: '0x312bb453c7e1d526ecd095b32b59da89f67bc7f5',
        quantity: 5500000,
        percentage: 1.3742,
      },
    ];
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  getHolders(): Holder[] {
    return this.holders;
  }
}

export default new TransactionDC();
