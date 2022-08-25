import { createSelector } from '@ngrx/store';

import { getBasketAddresses } from 'ish-core/store/customer/basket';

export const getBucketGoodsAcceptanceNote = (addressId: string) =>
  createSelector(
    getBasketAddresses,
    allAddress => allAddress?.find(ar => ar.id === addressId)?.goodsAcceptanceNote || ''
  );
