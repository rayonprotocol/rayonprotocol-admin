export default function createObserverSubject<T>(initialValueGetter: (...args: any[]) => T) {
  const observers = new Set<(data: T) => void>();

  const notify = (data?: T) => {
    const notifyingData = typeof data !== 'undefined'
      ? data
      : initialValueGetter && initialValueGetter() || undefined;
    Array.from(observers).forEach(ob => ob(notifyingData));
  };

  const register = (observer: (data: T) => void, willNotImediatelyNofify?: boolean) => {
    if (observers.has(observer)) return;
    observers.add(observer);

    const unregister = () => {
      if (!observers.has(observer)) return;
      observers.delete(observer);
    };

    if (!willNotImediatelyNofify) notify();
    return unregister;
  };

  return { notify, register };
}