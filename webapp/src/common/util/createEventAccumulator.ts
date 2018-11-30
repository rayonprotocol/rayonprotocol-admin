import { ContractEventObject } from './createEventSubscriber';

export default function createEventAccumulator<K extends string, T, RV>(
  map: Map<K, any>,
  key: K,
  accumulator: (preStaate: T, eventObject: ContractEventObject<RV>) => Promise<T>,
  callback?: (error: Error, nextState?: T) => void,
) {
  return async (eventObject: ContractEventObject<RV>) => {
    try {
      const prevState: T = map.get(key) as T;
      const nextState = await accumulator(prevState, eventObject);
      if (prevState !== nextState) {
        map.set(key, nextState);
      }
      if (callback) callback(null, nextState);
    } catch (error) {
      if (callback) callback(error);
    }
  };
}
