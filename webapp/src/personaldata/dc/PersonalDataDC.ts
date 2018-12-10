// agent
import PersonalDataContractAgent from 'personaldata/agent/PersonalDataContractAgent';

// model
import { PersonalDataCategory, PersonalDataItem, RewardCycle } from '../../../../shared/personaldata/model/PerosnalData';
import createObserverSubject from 'common/util/createObserverSubject';
import { ContractEventObject } from 'common/util/createEventSubscriber';
import attatchStoreToReducer from 'common/util/attatchStoreToReducer';
import AsyncInitiatable from 'common/util/AsyncInitiatable';

type PersonalDataStoreKey = 'DATA_CATEGORIES' | 'DATA_ITEMS';
type PersonalDataStoreValue = PersonalDataCategory[] | PersonalDataItem[];

interface PersonalDataCategoryUpdateEventArgs {
  code: string;
  category1: string;
  category2: string;
  category3: string;
  score: string;
  rewardCycle: RewardCycle;
  address: string;
}

class PersonalDataDC extends AsyncInitiatable {
  private store = new Map<PersonalDataStoreKey, PersonalDataStoreValue>([
    ['DATA_CATEGORIES', []],
    ['DATA_ITEMS', []],
  ]);

  protected async init() {
    await PersonalDataContractAgent.initiation;
    PersonalDataContractAgent.subscribeDataListEvent(
      attatchStoreToReducer(
        this.store, 'DATA_ITEMS',
        this.dataItemsReducer,
        this.dataItemsSubject.notify,
      ),
    );
    PersonalDataContractAgent.subscribeDataCategoryEvent(
      attatchStoreToReducer(
        this.store, 'DATA_CATEGORIES',
        this.dataCategoriesReducer,
        this.dataCategoriesSubject.notify,
      ),
    );

    this.fetchDataItems();
    this.fetchDataCategories();
  }

  private dataItemsSubject = createObserverSubject<PersonalDataItem[]>(
    () => this.store.get('DATA_ITEMS') as PersonalDataItem[],
  );
  public registerDataItemsObserver = this.dataItemsSubject.register;

  private dataCategoriesSubject = createObserverSubject<PersonalDataCategory[]>(
    () => this.store.get('DATA_CATEGORIES') as PersonalDataCategory[],
  );
  public registerDataCategoriesObserver = this.dataCategoriesSubject.register;

  private dataItemsReducer = async (prevPersonalDataItems: PersonalDataItem[], eventObject: ContractEventObject<{ borrowerId: string; categoryCode: string; borrowerAppId: string; }>): Promise<PersonalDataItem[]> => {
    const { event, returnValues: { borrowerId: borrowerAddress, categoryCode: rawCategoryCode, borrowerAppId: borrowerAppAddress } } = eventObject;
    if (!borrowerAddress || typeof rawCategoryCode === 'undefined' || !borrowerAppAddress) return prevPersonalDataItems;
    const categoryCode = Number(rawCategoryCode);

    switch (event) {
      case 'LogPersonalDataAdded': {
        const dataCategory = await PersonalDataContractAgent.getDataItem(borrowerAddress, categoryCode);
        return prevPersonalDataItems.concat(dataCategory);
      }
      case 'LogPersonalDataUpdated': {
        const dataCategory = await PersonalDataContractAgent.getDataItem(borrowerAddress, categoryCode);
        return prevPersonalDataItems.filter(b => b.borrowerAddress === borrowerAddress && b.code === categoryCode).concat(dataCategory);
      }
      case 'LogPersonalDataDeleted': {
        return prevPersonalDataItems.filter(b => b.borrowerAddress === borrowerAddress && b.code === categoryCode);
      }
      default:
        return prevPersonalDataItems;
    }
  }

  private dataCategoriesReducer = async (prevPersonalDataCategories: PersonalDataCategory[], eventObject: ContractEventObject<{ code: string }>): Promise<PersonalDataCategory[]> => {
    const { event, returnValues: { code: rawCode } } = eventObject;
    if (!rawCode) return prevPersonalDataCategories;
    const code = Number(rawCode);

    switch (event) {
      case 'LogPersonalDataCategoryAdded': {
        const dataCategory = await PersonalDataContractAgent.getDataCategory(code);
        return prevPersonalDataCategories.concat(dataCategory);
      }
      case 'LogPersonalDataCategoryUpdated': {
        const dataCategory = await PersonalDataContractAgent.getDataCategory(code);
        return prevPersonalDataCategories.filter(b => b.code !== code).concat(dataCategory);
      }
      case 'LogPersonalDataCategoryDeleted': {
        return prevPersonalDataCategories.filter(b => b.code !== code);
      }
      default:
        return prevPersonalDataCategories;
    }
  }

  public addDataCategory = PersonalDataContractAgent.addDataCategory;

  public updateDataCategory = PersonalDataContractAgent.updateDataCategory;

  public removeDataCategory = PersonalDataContractAgent.removeDataCategory;

  public fetchDataItems = async () => {
    const dataItems = await PersonalDataContractAgent.getDataItems();
    this.store.set('DATA_ITEMS', dataItems);
    this.dataItemsSubject.notify(dataItems);
  }

  public fetchDataCategories = async () => {
    const codes = await PersonalDataContractAgent.getDataCategoryCodes();
    const dataCategories = await Promise.all(codes.map(code => PersonalDataContractAgent.getDataCategory(code)));
    this.store.set('DATA_CATEGORIES', dataCategories);
    this.dataCategoriesSubject.notify(dataCategories);
  }
}

export default new PersonalDataDC();
