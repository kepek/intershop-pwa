import { createSelector } from '@ngrx/store';

import { getCamfilPwaState } from 'camfil-pwa/store/camfil-pwa-store';

export const getCamfilProductsState = createSelector(getCamfilPwaState, state => state.camfilProducts);

export const getCamfilProductsLoading = createSelector(getCamfilProductsState, state => state.loading);

export const getCamfilProductsError = createSelector(getCamfilProductsState, state => state.error);
