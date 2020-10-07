import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCamUserState } from '../store/cam-user-store';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamUserFacade {
  constructor(private store: Store) {}

  /**
   * example for debugging
   */
  camUserState$ = this.store.pipe(select(getCamUserState));
}
