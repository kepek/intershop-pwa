/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
