export interface ContractEventObject<T = any> {
  event: string;
  blockNumber: number;
  transactionIndex: number;
  logIndex: number;
  returnValues: T;
};

export type EventProcessor<RV> = (eventObject: ContractEventObject<RV>) => Promise<void>;

/**
 * Ensure `procesEvent` to process uniqe `eventObject`s
 * @param procesEvent
 */
function ensureUnique<RV = any>(procesEvent: EventProcessor<RV>): EventProcessor<RV> {
  const eventIdSelector = ({ blockNumber, transactionIndex, logIndex }: ContractEventObject<RV>) => `${blockNumber}-${transactionIndex}-${logIndex}`;
  let eventIdSet = new Set();

  return async (eventObject: ContractEventObject<RV>) => {
    const eventId = eventIdSelector(eventObject);
    // skip dup events
    if (eventIdSet.has(eventId)) return;

    eventIdSet.add(eventId);
    if (eventIdSet.size > 100) eventIdSet = new Set(Array.from(eventIdSet).slice(-50));
    await procesEvent(eventObject);
  };
}

/**
 * Ensure `procesEvent` to process `eventObject`s in sequence
 * by using mutex(`processing`) and array prototype methods(`unshift`, `pop`)
 * @param procesEvent
 */
function ensureInSequence<RV = any>(procesEvent: EventProcessor<RV>): EventProcessor<RV> {
  // shared state (queue, processing)
  const queue = [];
  let processing = false;

  return async (eventObject: ContractEventObject<RV>) => {
    if (typeof eventObject !== undefined) {
      queue.unshift(eventObject); // enqueue
    }

    if (processing) return;
    processing = true;

    while (queue.length > 0) {
      const leastRecentlyAddedEventObject = queue.pop(); // dequeue
      await procesEvent(leastRecentlyAddedEventObject);
    }
    processing = false;
  };
};

export type EventSubscriber<RV> = (procesEvent: EventProcessor<RV>) => void;
export default function createEventSubscriber<RV>(contractInstance): EventSubscriber<RV> {
  return (procesEvent: EventProcessor<RV>) => {
    const procesUniqeEventsInSequence = ensureInSequence(ensureUnique(procesEvent));
    contractInstance.events.allEvents().on('data', procesUniqeEventsInSequence);
  };
}
