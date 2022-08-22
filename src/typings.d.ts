/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

declare interface PromiseConstructor {
  allSettled(
    promises: Array<Promise<unknown>>
  ): Promise<Array<{ status: 'fulfilled' | 'rejected'; value?: unknown; reason?: unknown }>>;
}

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

interface ComponentChange<T, P extends keyof T> {
  previousValue: T[P];
  currentValue: T[P];
  firstChange: boolean;
}

type ComponentChanges<T> = {
  [P in keyof T]?: ComponentChange<T, P>;
};
