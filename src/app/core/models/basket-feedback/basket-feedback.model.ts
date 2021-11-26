import { LineItem } from 'ish-core/models/line-item/line-item.model';

export interface BasketFeedback {
  code: string;
  message: string;
  parameters?: {
    lineItemId?: string;
    productSku?: string;
    shippingRestriction?: string;
    scopes?: string; // data type will change IS-28602
    addressId?: string; // Camfil
    shipToAddress?: string; // Camfil
    deliveryAddressId?: string; // Camfil
    currency?: string; // Camfil
    customerThreshold?: string; // Camfil
    customerId?: string; // Camfil
  };
}

export interface BasketFeedbackView extends BasketFeedback {
  lineItem?: LineItem;
}
