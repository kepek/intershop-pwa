import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCamIccState } from '../store/cam-icc-store';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamIccFacade {
  constructor(private store: Store) {}

  /**
   * example for debugging
   */
  camIccState$ = this.store.pipe(select(getCamIccState));
}
