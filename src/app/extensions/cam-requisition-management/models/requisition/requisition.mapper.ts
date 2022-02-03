import { Injectable } from '@angular/core';

import { BasketData } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { OrderData } from 'ish-core/models/order/order.interface';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { Price } from 'ish-core/models/price/price.model';
import { User } from 'ish-core/models/user/user.model';

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
  static fromData(payload: RequisitionData, orderPayload?: OrderData): Requisition {
    if (!Array.isArray(payload.data)) {
      const { data } = payload;
      const emptyPrice: Price = {
        type: 'Money',
        value: 0,
        currency: data.userBudgets?.budget?.currency,
      };

      const defaultApproval: RequisitionApproval = {
        status: 'pending',
        statusCode: 'PENDING',
      };

      const defaultUser: User = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@mail.com',
      };

      const today = new Date().getTime();

      if (data) {
        const payloadData = (orderPayload ? orderPayload : payload) as BasketData;
        payloadData.data.calculated = true;

        return {
          ...BasketMapper.fromData(payloadData),
          id: data.id ? data.id : data.shippingAddress?.id,
          requisitionNo: data.requisitionNo ? data.requisitionNo : data.shippingAddress?.id,
          orderNo: data.orderNo,
          creationDate: data.creationDate ? data.creationDate : today,
          userBudget: { ...data.userBudgets, spentBudget: data.userBudgets?.spentBudget || emptyPrice },
          user: data.userInformation ? data.userInformation : defaultUser,
          lineItemCount: data.lineItemCount,
          approval: data.approval
            ? {
                ...data.approvalStatus,
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
      return (
        payload.data
          /* filter requisitions that didn't need an approval */
          // TODO: Enable when there is all data coming from endpoint
          // .filter(data => data.requisitionNo)
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
          }))
      );
    }
  }
}
