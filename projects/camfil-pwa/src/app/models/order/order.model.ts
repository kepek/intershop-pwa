import { Order as IshOrder } from 'ish-core/models/order/order.model';

export interface Order extends IshOrder {
  camfilOrderUUID?: string;
  readToken?: string;
}
