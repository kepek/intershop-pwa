import { createAction } from '@ngrx/store';

import { Product } from 'ish-core/models/product/product.model';
import { payload } from 'ish-core/utils/ngrx-creators';

import { DataLayerPageType } from '../../models/data-layer-event.type';

export const trackViewItem = createAction('[Tracking] Track View Item', payload<{ product: Product }>());

export const trackViewItemList = createAction(
  '[Tracking] Track View Item List',
  payload<{ product: Product; page: DataLayerPageType }>()
);
