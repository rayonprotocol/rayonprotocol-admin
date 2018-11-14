export default function createObserverSubject<T>(initialValueGetter: (...args: any[]) => T) {
  const observers = new Set<(data: T) => void>();

  const notify = (data?: T) => {
    Array.from(observers).forEach(ob => ob(data || initialValueGetter && initialValueGetter() || undefined));
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