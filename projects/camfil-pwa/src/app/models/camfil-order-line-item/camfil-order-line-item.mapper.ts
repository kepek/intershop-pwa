import { OrderLineItemData } from './camfil-order-line-item.interface';
import { CamfilOrderLineItem } from './camfil-order-line-item.model';

export class CamfilOrderLineItemMapper {
  static fromData(data: OrderLineItemData): CamfilOrderLineItem {
    if (data) {
      return {
        articleName: data.articleName,
        boxLabel: data.boxLabel,
        currency: data.currency,
        deliveredQty: data.deliveredQty,
        deliveryDate: data.deliveryDate,
        id: data.id,
        name: data.name,
        orderedQty: data.orderedQty,
        ownerId: data.ownerId,
        sku: data.sku,
        totalRowCustomerPrice: data.totalRowCustomerPrice,
        type: data.type,
        rowNumber: data.rowNumber,
        diameter: data.diameter,
        width: data.width,
        height: data.height,
        depth: data.depth,
      };
    }
  }
}
