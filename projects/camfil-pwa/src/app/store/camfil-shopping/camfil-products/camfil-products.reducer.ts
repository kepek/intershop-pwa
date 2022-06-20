import { createReducer } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { loadProducts, loadProductsFail, loadProductsSuccess } from './camfil-products.actions';

export interface CamfilProductsState {
  loading: boolean;
  error: HttpError;
}

export const camfilInitialState: CamfilProductsState = {
  loading: false,
  error: undefined,
};

export const camfilProductsReducer = createReducer(
  camfilInitialState,
  setLoadingOn(loadProducts),
  unsetLoadingAndErrorOn(loadProductsSuccess),
  setErrorOn(loadProductsFail)
);
