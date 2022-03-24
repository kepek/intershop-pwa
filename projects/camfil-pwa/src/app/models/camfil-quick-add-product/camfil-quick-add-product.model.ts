import { CamCardItemComment, CamCardMeasurement } from 'src/app/extensions/cam-cards/models/cam-card/cam-card.model';

import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface QuickAddProduct {
  sku: string;
  quantity: number;
  lineItemAttributes?: Attribute<unknown>[];
  boxLabel?: CamCardItemComment;
  measurements?: CamCardMeasurement;
}
