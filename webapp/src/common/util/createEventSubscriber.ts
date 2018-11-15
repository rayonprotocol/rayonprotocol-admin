export interface ContractEventObject<T> {
  event: string;
  blockNumber: number;
  transactionIndex: number;
  logIndex: number;
  returnValues: T;
};

const eventIdSelector = ({ blockNumber, transactionIndex, logIndex }: ContractEventObject<any>) => {
  return `${blockNumber}-${transactionIndex}-${logIndex}`;
}
export type EventProcessor<RV> = (eventObject: ContractEventObject<RV>) => Promise<void>;
function processEventsInSequence<RV = any>(procesEvent: EventProcessor<RV>) {
  const queue = [];
  let eventIdSet = new Set();
  let processing = false;

  return async (eventObject: ContractEventObject<RV>) => {
    queue.unshift(eventObject);
    if (processing) return;
    processing = true;

    while (queue.length > 0) {
      const poppedEventObject = queue.pop();
      const eventId = eventIdSelector(poppedEventObject);
      if (!eventIdSet.has(eventId)) { // skip dup events
        await procesEvent(poppedEventObject);
        eventIdSet.add(eventId);
      }
      if (eventIdSet.size > 100) eventIdSet = new Set(Array.from(eventIdSet).slice(-50));
    }
    processing = false;
  };
};
export default function createEventSubscriber(contractInstance) {

  return <RV>(procesEvent: EventProcessor<RV>) => {
    const eventProc = processEventsInSequence(procesEvent);
    contractInstance.events.allEvents().on('data', eventProc);
  };
}
