import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCamDemoState } from '../store/cam-demo-store';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamDemoFacade {
  constructor(private store: Store) {}

  /**
   * example for debugging
   */
  camDemoState$ = this.store.pipe(select(getCamDemoState));
}
