/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

declare var PRODUCTION_MODE: boolean;

declare var SERVICE_WORKER: boolean;

declare var NGRX_RUNTIME_CHECKS: boolean;

declare var PWA_VERSION: string;

declare interface PromiseConstructor {
  allSettled(
    promises: Array<Promise<unknown>>
  ): Promise<Array<{ status: 'fulfilled' | 'rejected'; value?: unknown; reason?: unknown }>>;
}

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
