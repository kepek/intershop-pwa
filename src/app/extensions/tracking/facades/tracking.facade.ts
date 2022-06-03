import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Product } from 'ish-core/models/product/product.model';

import { trackViewCart, trackViewItem } from '../store/tracking-events';

// not-dead-code
@Injectable({ providedIn: 'root' })
export class TrackingFacade {
  constructor(private store: Store) {}

  trackViewCart() {
    this.store.dispatch(trackViewCart());
  }

  trackProductDetails(product: Product) {
    this.store.dispatch(trackViewItem({ product }));
  }
}
