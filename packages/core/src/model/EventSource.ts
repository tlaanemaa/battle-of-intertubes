import { FastMap } from "./FastMap";

type Handler = () => void;

export class EventSource<K extends string | number> {
  private readonly store = new FastMap<Set<Handler>>();

  public on(eventName: K, handler: Handler, triggerImmediately = false) {
    if (!this.store.has(eventName)) this.store.set(eventName, new Set());
    this.store.get(eventName)!.add(handler);
    if (triggerImmediately) handler();
    return this;
  }

  public off(eventName: K, handler: Handler) {
    const handlers = this.store.get(eventName);
    if (handlers) {
      handlers.delete(handler);
    }
    return this;
  }

  protected trigger(eventName: K) {
    const handlers = this.store.get(eventName);
    if (handlers) {
      handlers.forEach((handler) => handler());
    }
  }
}
