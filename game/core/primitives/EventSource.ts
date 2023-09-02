import { injectable } from "inversify";
import { FastMap } from "./FastMap";

type Handler<V> = (x: V) => void;

@injectable()
export class EventSource<K extends string | number, V> {
  private readonly store = new FastMap<Set<Handler<V>>>();

  public on(eventName: K, handler: Handler<V>) {
    if (!this.store.has(eventName)) this.store.set(eventName, new Set());
    this.store.get(eventName)!.add(handler);
    return this;
  }

  public off(eventName: K, handler: Handler<V>) {
    const handlers = this.store.get(eventName);
    if (handlers) {
      handlers.delete(handler);
    }
    return this;
  }

  protected trigger(eventName: K, value: V) {
    const handlers = this.store.get(eventName);
    if (handlers) {
      handlers.forEach((handler) => handler(value));
    }
  }
}
