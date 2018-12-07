import { PersonalDataCategory, PersonalDataItem } from '../../../../shared/personaldata/model/PerosnalData';

import { txResultToArr, mapDateProp } from 'common/util/txResult';
import createEventSubscriber from 'common/util/createEventSubscriber';

import { Contract } from 'web3/types';
import RayonContractAgent from 'common/agent/RayonContractAgent';

const artifacts = {
  PersonalDataCategory: require('../../../../dev/contract/.volume/personaldata/PersonalDataCategory.json'),
  PersonalDataList: require('../../../../dev/contract/.volume/personaldata/PersonalDataList.json'),
};

class PersonalDataContractAgent extends RayonContractAgent {

  private perosnalDataCategory: Contract;
  private perosnalDataList: Contract;
  public subscribeDataListEvent;
  public subscribeDataCategoryEvent;

  protected async init() {
    const [perosnalDataCategory, perosnalDataList] = await Promise.all([
      PersonalDataContractAgent.getInstance(artifacts.PersonalDataCategory),
      PersonalDataContractAgent.getInstance(artifacts.PersonalDataList),
    ]);

    this.perosnalDataCategory = perosnalDataCategory;
    this.perosnalDataList = perosnalDataList;
    this.subscribeDataListEvent = createEventSubscriber(this.perosnalDataList);
    this.subscribeDataCategoryEvent = createEventSubscriber(this.perosnalDataCategory);
  }

  public getDataItems = async (): Promise<PersonalDataItem[]> => {
    const sizeRaw: number = await this.perosnalDataList.methods.size().call();
    const size = !isNaN(sizeRaw) ? Number(sizeRaw) : 0;
    if (!size) return [];

    const rawDataItems = await Promise.all(
      [...Array(size)].map((_, index) => this.perosnalDataList.methods.getByIndex(index).call()),
    );
    const dataItems: PersonalDataItem[] = rawDataItems.map(txResultToArr).map(([borrowerAddress, code, dataHash, borrowerAppAddress, updatedEpochTime]) =>
      mapDateProp('updatedEpochTime', 'updatedDate')({
        borrowerAddress, code: Number(code), dataHash, borrowerAppAddress, updatedEpochTime,
      }));

    return dataItems;
  }

  public getDataItem = async (borrowerAddress: PersonalDataItem['borrowerAddress'], categoryCode: PersonalDataItem['code']): Promise<PersonalDataItem> => {
    const dataItemResult = await this.perosnalDataList.methods.get(borrowerAddress, categoryCode).call();
    const [dataHash, borrowerAppAddress, updatedEpochTime] = txResultToArr(dataItemResult);
    return mapDateProp('updatedEpochTime', 'updatedDate')({
      borrowerAddress, code: categoryCode, dataHash, borrowerAppAddress, updatedEpochTime,
    });
  }

  public getDataCategoryCodes = async (): Promise<number[]> => {
    const codesResults: number[] = await this.perosnalDataCategory.methods.getCodeList().call();
    const codes = codesResults.map(codesResult => Number(codesResult));
    return codes;
  }

  public getDataCategory = async (code: PersonalDataCategory['code']): Promise<PersonalDataCategory> => {
    const categoryResult = await this.perosnalDataCategory.methods.get(code).call();
    const [, category1, category2, category3, borrowerAppId, score, rewardCycle, updatedEpochTime] = txResultToArr(categoryResult);
    return mapDateProp('updatedEpochTime', 'updatedDate')({
      code,
      category1,
      category2,
      category3,
      borrowerAppAddress: borrowerAppId,
      score,
      rewardCycle,
      updatedEpochTime,
    });
  }

  public addDataCategory = async (
    code: PersonalDataCategory['code'],
    category1: PersonalDataCategory['category1'],
    category2: PersonalDataCategory['category2'],
    category3: PersonalDataCategory['category3'],
    borrowerAppId: PersonalDataCategory['borrowerAppAddress'],
    score: PersonalDataCategory['score'],
    rewardCycle: PersonalDataCategory['rewardCycle']
  ) => {
    await this.perosnalDataCategory.methods.add(
      code,
      category1,
      category2,
      category3,
      borrowerAppId,
      score,
      rewardCycle,
    ).send({ from: '0xFecF01A4f52Cb911C02FF656c8Cb4BbD91a8eaf6' });
  }

  public updateDataCategory = async (
    code: PersonalDataCategory['code'],
    category1: PersonalDataCategory['category1'],
    category2: PersonalDataCategory['category2'],
    category3: PersonalDataCategory['category3'],
    score: PersonalDataCategory['score'],
    rewardCycle: PersonalDataCategory['rewardCycle']
  ) => {
    await this.perosnalDataCategory.methods.update(
      code,
      category1,
      category2,
      category3,
      score,
      rewardCycle,
    ).send({ from: '0xFecF01A4f52Cb911C02FF656c8Cb4BbD91a8eaf6' });
  }

  public removeDataCategory = async (
    code: PersonalDataCategory['code']
  ) => {
    await this.perosnalDataCategory.methods.remove(code).send({ from: '0xFecF01A4f52Cb911C02FF656c8Cb4BbD91a8eaf6' });
  }
}

export default new PersonalDataContractAgent();
