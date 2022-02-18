import { AddressData } from 'ish-core/models/address/address.interface';
import { Address } from 'ish-core/models/address/address.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';
import { PaymentData } from 'ish-core/models/payment/payment.interface';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';
import { User } from 'ish-core/models/user/user.model';

import { RequisitionApproval, RequisitionUserBudget } from './requisition.model';

export interface RequisitionBaseData extends BasketBaseData {
  // Adjust to BE response
  requisitionNo?: string;
  orderNo?: string;
  order?: {
    itemId: string;
  };
  creationDate: string;
  lineItemCount: number;
  userInformation: User;
  // ToDO: remove unnecessary
  userBudgets: RequisitionUserBudget;
  shippingAddress: Address;

  approvalStatus: RequisitionApproval;
}

export interface RequisitionData {
  data: RequisitionBaseData | RequisitionBaseData[];
  included?: {
    invoiceToAddress?: { [urn: string]: AddressData };
    lineItems?: { [id: string]: LineItemData };
    discounts?: { [id: string]: BasketRebateData };
    lineItems_discounts?: { [id: string]: BasketRebateData };
    commonShipToAddress?: { [urn: string]: AddressData };
    commonShippingMethod?: { [id: string]: ShippingMethodData };
    payments?: { [id: string]: PaymentData };
    payments_paymentMethod?: { [id: string]: PaymentMethodBaseData };
    payments_paymentInstrument?: { [id: string]: PaymentInstrument };
  };
  infos?: BasketInfo[];
}
