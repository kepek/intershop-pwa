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

import { CamfilRequisitionApproval, RequisitionUserBudget } from './camfil-requisition.model';

export interface CamfilRequisitionBaseData extends BasketBaseData {
  // Adjust to BE response
  requisitionNo?: string;
  basketId: string;
  orderNo?: string;
  order?: {
    itemId: string;
  };
  approvalCreationDate: string;
  lineItemCount: number;
  creator: User;
  orderMark: string;
  invoiceLabel: string;
  phoneNumber: string;
  userBudgets: RequisitionUserBudget;
  shippingAddress?: Address;
  status: string;
  info?: string;
  approvalStatus: CamfilRequisitionApproval;
}

export interface CamfilRequisitionData {
  data: CamfilRequisitionBaseData | CamfilRequisitionBaseData[];
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
