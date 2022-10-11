import { Injectable } from '@angular/core';

import { AddressMapper } from 'ish-core/models/address/address.mapper';

import { QuoteSurchargeItemMapper } from '../quote-surcharge-item/quote-surcharge-item.mapper';
import { QuoteStatus } from '../quote/quote.model';

import { QuoteDetailsData } from './quote-details.interface';
import { QuoteDetails } from './quote-details.model';

@Injectable({ providedIn: 'root' })
export class QuoteDetailsMapper {
  fromData(data: QuoteDetailsData): QuoteDetails {
    if (data) {
      return {
        id: data.id,
        type: data.type,
        quotationType: data.quotationType,
        customerName: data.customerName,
        customerNumber: data.customerId,
        customerDepartment: data.customerDepartment,
        camfilQuoteNumber: data.erpnumber || '-',
        customerQuoteNumber: data.number,
        requestedBy: data.requestedBy,
        requestedDate: data.creationDate,
        quotationDate: data.submittedDate,
        status: data.status,
        statusText: this.getStatusText(data.status),
        orderChannel: data.orderChannel,
        displayName: data.displayName,
        number: data.number,
        customerId: data.customerId,
        userFirstName: data.userFirstName,
        userLastName: data.userLastName,
        phone: data.phone,
        customerServiceNote: data.customerServiceNote,
        editable: data.editable,
        submitted: data.submitted,
        total: data.total,
        items: [...data.items].map(item => {
          if (!item.singlePrice) {
            item.singlePrice = {
              ...item.totalPrice,
              value: item.totalPrice.value / item.quantity.value,
            };
          }
          const deliveryDate = item.deliveryDate ? new Date(item.deliveryDate) : undefined;
          return {
            ...item,
            deliveryDate,
          };
        }),
        deliveryAddress: data.deliveryAddress ? AddressMapper.fromData(data.deliveryAddress) : undefined,
        quotationReference: data.quotationReference,
        validToDate: data.validToDate,
        taxAmount: data.taxAmount,
        totalPriceAfterDiscountExVAT: data.totalPriceAfterDiscountExVAT,
        totalQty: data.totalQty,
        surchargeItems: QuoteSurchargeItemMapper.fromListData([...data.surchargeItems]),
      };
    } else {
      throw new Error(`QuoteDetails data is required`);
    }
  }

  private getStatusText(statusId: number): string {
    return QuoteStatus[statusId];
  }
}
