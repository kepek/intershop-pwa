import { UserBudget } from 'organization-management';

import { Address } from 'ish-core/models/address/address.model';
import { AbstractBasket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Price } from 'ish-core/models/price/price.model';
import { User } from 'ish-core/models/user/user.model';

export type CamfilRequisitionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type CamfilRequisitionViewer = 'buyer' | 'approver';

export interface CamfilRequisitionApproval {
  status: string;
  statusCode?: string;
  approvalDate?: number;
  approver?: { firstName: string; lastName: string };
  approvalComment?: string;
  customerApprovers?: { firstName: string; lastName: string; email: string }[];
}

export interface RequisitionUserBudget extends UserBudget {
  spentBudgetIncludingThisRequisition?: Price;
  remainingBudgetIncludingThisRequisition?: Price;
}

type CamfilRequisitionBasket = Omit<AbstractBasket<LineItem>, 'approval'>;

export interface CamfilRequisition extends CamfilRequisitionBasket {
  requisitionNo: string;
  orderNo?: string;
  creationDate: number;
  lineItemCount: number;
  orderMark: string;
  invoiceLabel: string;
  phoneNumber: string;
  user: User;
  requisitionCustomer: CamfilRequisitionCustomer;
  shippingAddress: Address;
  userBudget: RequisitionUserBudget;
  info: string;
  userComment: string;
  approval: CamfilRequisitionApproval;
  canApprove?: boolean;
}

export interface CamfilRequisitionListFilter {
  customer?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  camfilRequisitionStatus?: string[];
}

export interface CamfilEditRequisition extends CamfilRequisition {
  customerId?: string;
  company?: string;
  building?: string;
  address?: string;
  addressLine2?: string;
  zipCode?: string;
  area?: string;
}

export interface CamfilRequisitionCustomer extends Customer {
  id: string;
}
