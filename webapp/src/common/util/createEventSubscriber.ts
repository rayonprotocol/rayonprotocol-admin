export interface ContractEventObject<T> {
  event: string;
  returnValues: T;
};

export type EventProcessor<RV> = (eventObject: ContractEventObject<RV>) => Promise<void>;

function processEventsInSequence<RV = any>(procesEvent: EventProcessor<RV>) {
  const queue = [];
  let processing = false;

  return async (eventObject: ContractEventObject<RV>) => {
    queue.unshift(eventObject);
    if (processing) return;
    processing = true;

    while (queue.length > 0) {
      await procesEvent(queue.pop());
    }
    processing = false;
  };
};

export default function createEventSubscriber(contractInstance) {
  return <RV>(procesEvent: EventProcessor<RV>) => {
    const eventProc = processEventsInSequence(procesEvent);
    window['k'] = eventProc;
    contractInstance.events.allEvents().on('data', eventProc);
  };
}
