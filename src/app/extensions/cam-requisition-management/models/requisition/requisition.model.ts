import { UserBudget } from 'organization-management';

import { Address } from 'ish-core/models/address/address.model';
import { AbstractBasket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Price } from 'ish-core/models/price/price.model';
import { User } from 'ish-core/models/user/user.model';

export type RequisitionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type RequisitionViewer = 'buyer' | 'approver';

export interface RequisitionApproval {
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

type RequisitionBasket = Omit<AbstractBasket<LineItem>, 'approval'>;

export interface Requisition extends RequisitionBasket {
  requisitionNo: string;
  orderNo?: string;
  creationDate: number;
  lineItemCount: number;
  orderMark: string;
  invoiceLabel: string;
  phoneNumber: string;
  user: User;
  requisitionCustomer: RequisitionCustomer;
  shippingAddress: Address;
  userBudget: RequisitionUserBudget;
  info: string;
  approval: RequisitionApproval;
}

export interface RequisitionListFilter {
  customer?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  requisitionStatus?: string[];
}

export interface EditRequisition extends Requisition {
  customerId?: string;
  company?: string;
  building?: string;
  address?: string;
  addressLine2?: string;
  zipCode?: string;
  area?: string;
}

export interface RequisitionCustomer extends Customer {
  id: string;
}
