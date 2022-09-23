import { createSelector } from '@ngrx/store';

import { getCurrentBasket } from 'ish-core/store/customer/basket/basket.selectors';

export const getCalculatedBasket = createSelector(getCurrentBasket, basket => basket && basket.calculated);
