import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCamfilOrderTemplatesState } from '../store/camfil-order-templates-store';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamfilOrderTemplatesFacade {
  constructor(private store: Store) {}

  /**
   * example for debugging
   */
  camfilOrderTemplatesState$ = this.store.pipe(select(getCamfilOrderTemplatesState));
}
