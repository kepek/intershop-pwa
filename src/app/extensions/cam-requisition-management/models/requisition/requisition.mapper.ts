import { Injectable } from '@angular/core';

import { BasketData } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { Customer } from 'ish-core/models/customer/customer.model';
import { LineItemMapper } from 'ish-core/models/line-item/line-item.mapper';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';

import { RequisitionBaseData, RequisitionData } from './requisition.interface';
import { Requisition, RequisitionApproval } from './requisition.model';

const emptyPriceItem: PriceItem = {
  type: 'PriceItem',
  gross: 0,
  net: 0,
  currency: 'N/A',
};

@Injectable({ providedIn: 'root' })
export class RequisitionMapper {
  static fromData(payload: RequisitionData): Requisition {
    if (!Array.isArray(payload.data)) {
      const { data, included } = payload;

      const emptyPrice: Price = {
        type: 'Money',
        value: 0,
        currency: data.userBudgets?.budget?.currency,
      };

      const defaultApproval: RequisitionApproval = {
        status: 'pending',
        statusCode: 'PENDING',
      };

      if (data) {
        const payloadData = payload as BasketData;
        payloadData.data.calculated = true;
        const lineItems = RequisitionMapper.getLineItemsData(included);
        const approvalStatus = RequisitionMapper.getApprovalStatus(data);

        return {
          ...BasketMapper.fromData(payloadData),
          id: data.basketId,
          requisitionNo: data.requisitionNo,
          creationDate: RequisitionMapper.convertToData(data.creationDate),
          userBudget: { ...data.userBudgets, spentBudget: data.userBudgets?.spentBudget || emptyPrice },
          user: data.creator,
          orderMark: data.orderMark,
          invoiceLabel: data.invoiceLabel,
          info: data.info,
          lineItemCount: data.lineItemCount,
          lineItems,
          requisitionCustomer: RequisitionMapper.getCustomerData(data),
          shippingAddress: data.shippingAddress,
          approval: approvalStatus
            ? {
                ...approvalStatus,
                customerApprovers: data.approval?.customerApproval?.approvers,
              }
            : defaultApproval,
        };
      } else {
        throw new Error(`requisitionData is required`);
      }
    }
  }

  static fromElemenetsToListData(payload: { elements: RequisitionBaseData[] }): RequisitionData {
    const { elements, ...rest } = payload;
    return { ...rest, data: elements };
  }

  static fromListData(payload: RequisitionData): Requisition[] {
    if (Array.isArray(payload.data)) {
      return payload.data
        .filter(data => data.requisitionNo)
        .map(data => ({
          ...RequisitionMapper.fromData({ ...payload, data }),
          totals: {
            itemTotal: data.totals ? PriceItemMapper.fromPriceItem(data.totals.itemTotal) : undefined,
            total: data.totals ? PriceItemMapper.fromPriceItem(data.totals.grandTotal) : emptyPriceItem,
            isEstimated: false,
            discountTotal: {
              type: 'PriceItem',
              gross: 0,
              net: 0,
              currency: 'EUR',
            },
          },
        }));
    }
  }

  static convertToData(payloadData: string): number {
    if (!payloadData) {
      return;
    }

    const date = String(payloadData)?.split('T');

    return new Date(date[0]?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')).getTime();
  }

  static getLineItemsData(included): LineItem[] {
    const lineItems = [];
    if (included) {
      Object?.keys(included?.lineItems).map(key => {
        lineItems.push(LineItemMapper.fromData(included.lineItems[key], included.lineItems_discounts));
      });
    }
    return lineItems;
  }

  static getCustomerData(payloadData): Customer {
    return payloadData.customer;
  }

  static getApprovalStatus(payloadData): RequisitionApproval {
    const { status } = payloadData;
    const statusDictionary = {
      SUBMITTED: {
        status: 'Pending',
        statusCode: 'PENDING',
      },
      APPROVED: {
        status: 'Approved',
        statusCode: 'Approved',
      },
      REJECTED: {
        status: 'Rejected',
        statusCode: 'REJECTED',
      },
    };

    return statusDictionary[status];
  }
}
