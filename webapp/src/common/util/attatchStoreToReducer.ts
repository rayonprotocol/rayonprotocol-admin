import { ContractEventObject, EventProcessor } from './createEventSubscriber';

/**
 * attach store to inject preState to reducer and to get nextState from reducer then notify if necessary
 * @param store to get preState and to set nextState
 * @param key an idenditfier for the state
 * @param reduceEvents function that reduce eventObjects into nextState
 * @param notifyNextState notify if state is changed
 * @param notifyError notify if error is thrown
 */
export default function attatchStoreToReducer<K extends string, T, RV>(
  store: Map<K, any>,
  key: K,
  reduceEvents: (preState: T, eventObject: ContractEventObject<RV>) => Promise<T>,
  notifyNextState?: (nextState?: T) => void,
  notifyError?: (error?: Error) => void,
): EventProcessor<RV> {
  return async (eventObject: ContractEventObject<RV>) => {
    try {
      const prevState: T = store.get(key) as T;
      const nextState = await reduceEvents(prevState, eventObject);
      if (prevState !== nextState) {
        store.set(key, nextState);
        if (notifyNextState) notifyNextState(nextState);
      }
    } catch (error) {
      if (notifyError) notifyError(error);
    }
  };
}
