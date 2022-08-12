import { createAction } from '@ngrx/store';

import { Product } from 'ish-core/models/product/product.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadProducts = createAction('[Camfil Products Internal] Load Products', payload<{ skus: string[] }>());

export const loadProductsFail = createAction(
  '[Camfil Products API] Load Products Fail',
  httpError<{ skus: string[] }>()
);

export const loadProductsSuccess = createAction(
  '[Camfil Products API] Load Products Success',
  payload<{ products: Product[] }>()
);

export const loadProductsIfNotLoaded = createAction(
  '[Camfil Products Internal] Load Products if not Loaded',
  payload<{ skus: string[] }>()
);
