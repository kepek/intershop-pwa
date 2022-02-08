import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { CamCardItemComment, CamCardMeasurement } from '../../../models/cam-card/cam-card.model';

export interface ProductAddFormData {
  sku: string;
  quantity: number;
  lineItemAttributes?: Attribute<unknown>[];
  boxLabel?: CamCardItemComment;
  measurements?: CamCardMeasurement;
}
