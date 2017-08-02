import {InstanceService} from './instance.service';
import { Injector } from '@angular/core';
import {DataEmitterService} from './dataEmitter.service';

export class Abc extends Injector {
  get(token: any, notFoundValue?: any) {
    return token;
  }
}

describe('InstanceService test', () => {
  let instanceService: InstanceService;

  beforeEach(() => {
   instanceService = new InstanceService(new Abc());
  });

  it('should return a not null object', () => {
    let p;
    p = instanceService.getInstance(DataEmitterService);
    expect(p).not.toBeNull();
  });
});
