import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCamAhuState } from '../store/cam-ahu-store';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamAhuFacade {
  constructor(private store: Store) {}

  /**
   * example for debugging
   */
  camAhuState$ = this.store.pipe(select(getCamAhuState));
}
