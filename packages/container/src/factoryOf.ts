import { inject, injectable, interfaces } from "inversify";
import { container } from "./container";

type AnyConstructor<T> = new (...args: any) => T;

export const factoryOf = <T>(constructor: AnyConstructor<T>) => {
  const rawFactoryId = Symbol.for(`raw-${constructor.name}-factory`);

  container
    .bind<interfaces.Factory<T>>(rawFactoryId)
    .toFactory<T>(
      (context: interfaces.Context) => () =>
        context.container.resolve<T>(constructor)
    );

  @injectable()
  class DependencyFactory {
    public readonly get: () => T;

    constructor(@inject(rawFactoryId) factory: () => T) {
      this.get = factory;
    }
  }

  return DependencyFactory;
};
