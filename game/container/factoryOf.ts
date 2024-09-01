import { inject, injectable, interfaces } from "inversify";
import { container as globalContainer } from "./container";

type AnyConstructor<T> = new (...args: any) => T;

/**
 * Utility function to create factory classes for other classes.
 * This makes working with factories easier as you can perform class based injections.
 *
 * Example:
 * ```ts
 * class Moose {}
 * export class MooseFactory extends factoryOf(Moose) {}
 * container.bind(MooseFactory).toSelf();
 * ```
 */
export const factoryOf = <T>(
  constructor: AnyConstructor<T>,
  container = globalContainer,
) => {
  const rawFactoryId = Symbol.for(`raw-${constructor.name}-factory`);

  container
    .bind<interfaces.Factory<T>>(rawFactoryId)
    .toFactory<T>(
      (context: interfaces.Context) => () =>
        context.container.resolve<T>(constructor),
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
