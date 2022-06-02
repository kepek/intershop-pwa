import { Injectable } from '@angular/core';

import { BasketData } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { LineItemMapper } from 'ish-core/models/line-item/line-item.mapper';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';

import { CamfilRequisitionBaseData, CamfilRequisitionData } from './camfil-requisition.interface';
import { CamfilRequisition, CamfilRequisitionApproval, CamfilRequisitionCustomer } from './camfil-requisition.model';

const emptyPriceItem: PriceItem = {
  type: 'PriceItem',
  gross: 0,
  net: 0,
  currency: 'N/A',
};

@Injectable({ providedIn: 'root' })
export class CamfilRequisitionMapper {
  static fromData(payload: CamfilRequisitionData): CamfilRequisition {
    if (!Array.isArray(payload.data)) {
      const { data, included } = payload;

      const emptyPrice: Price = {
        type: 'Money',
        value: 0,
        currency: data.userBudgets?.budget?.currency,
      };

      const defaultApproval: CamfilRequisitionApproval = {
        status: 'pending',
        statusCode: 'PENDING',
      };

      if (data) {
        const payloadData = payload as BasketData;
        payloadData.data.calculated = true;
        const lineItems = CamfilRequisitionMapper.getLineItemsData(included, data.approval);
        const approvalStatus = CamfilRequisitionMapper.getApprovalStatus(data.approval);
        const lineItemCount = CamfilRequisitionMapper.getLineItemsQuantityCount(lineItems);

        return {
          ...BasketMapper.fromData(payloadData),
          id: data.basketId,
          requisitionNo: data.requisitionNo,
          creationDate: CamfilRequisitionMapper.convertToData(data.approvalCreationDate),
          userBudget: { ...data.userBudgets, spentBudget: data.userBudgets?.spentBudget || emptyPrice },
          user: data.creator,
          orderMark: data.orderMark,
          invoiceLabel: data.invoiceLabel,
          phoneNumber: data.phoneNumber,
          info: data.info,
          userComment: data.userComment,
          lineItemCount,
          lineItems,
          requisitionCustomer: CamfilRequisitionMapper.getCustomer(data),
          shippingAddress: data.shippingAddress,
          approval: data.approval
            ? {
                ...data.approval,
                ...approvalStatus,
              }
            : defaultApproval,
        };
      } else {
        throw new Error(`requisitionData is required`);
      }
    }
  }

  static fromElemenetsToListData(payload: { elements: CamfilRequisitionBaseData[] }): CamfilRequisitionData {
    const { elements, ...rest } = payload;
    return { ...rest, data: elements };
  }

  static fromListData(payload: CamfilRequisitionData): CamfilRequisition[] {
    if (Array.isArray(payload.data)) {
      return payload.data
        .filter(data => data.requisitionNo)
        .map(data => ({
          ...CamfilRequisitionMapper.fromData({ ...payload, data }),
          totals: {
            itemQuantityTotal: 0,
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

  static convertToData(payloadData: number): number {
    if (!payloadData) {
      return;
    }

    const date = new Date(payloadData);

    return date.getTime();
  }

  static getLineItemsData(included, approvalData): LineItem[] {
    let lineItems = [];
    const { lineItemStatuses } = approvalData || [];

    if (included) {
      Object?.keys(included?.lineItems).map(key => {
        lineItems.push(LineItemMapper.fromData(included.lineItems[key], included.lineItems_discounts));
      });
    }
    if (lineItemStatuses?.length) {
      lineItems = lineItems.map(li => {
        const requisitionLineItemStatus = lineItemStatuses.find(status => status.lineItemId === li.id).status;

        return {
          ...li,
          requisitionLineItemStatus,
        };
      });
    }

    return lineItems;
  }

  static getCustomer(payloadData): CamfilRequisitionCustomer {
    return payloadData.customer;
  }

  static getApprovalStatus(payloadData): CamfilRequisitionApproval {
    const { status } = payloadData || {};
    const statusDictionary = {
      SUBMITTED: {
        status: 'Pending',
        statusCode: 'PENDING',
      },
      PARTLY_APPROVED: {
        status: 'Partial Approved',
        statusCode: 'PARTLY_APPROVED',
      },
      APPROVED: {
        status: 'Approved',
        statusCode: 'APPROVED',
      },
      COMPLETED: {
        status: 'Approved',
        statusCode: 'APPROVED',
      },
      REFUSED: {
        status: 'Rejected',
        statusCode: 'REJECTED',
      },
    };

    return statusDictionary[status];
  }

  static getLineItemsQuantityCount(lineItemsData: LineItem[]) {
    return lineItemsData.reduce((a, b) => a + b.quantity.value, 0);
  }
}
