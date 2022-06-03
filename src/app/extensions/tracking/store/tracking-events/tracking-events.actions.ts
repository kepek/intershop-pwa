import { createAction } from '@ngrx/store';

import { Product } from 'ish-core/models/product/product.model';
import { payload } from 'ish-core/utils/ngrx-creators';

export const trackViewCart = createAction('[Tracking] Track View Cart');

export const trackViewItem = createAction('[Tracking] Track View Item', payload<{ product: Product }>());
