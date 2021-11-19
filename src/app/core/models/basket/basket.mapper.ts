import { AddressMapper } from 'ish-core/models/address/address.mapper';
import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketRebateMapper } from 'ish-core/models/basket-rebate/basket-rebate.mapper';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import {
  BasketBaseData,
  BasketData,
  BasketExtension,
  GuestBasket,
  GuestBasketData,
} from 'ish-core/models/basket/basket.interface';
import { LineItemMapper } from 'ish-core/models/line-item/line-item.mapper';
import { PaymentMapper } from 'ish-core/models/payment/payment.mapper';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { ShippingMethodMapper } from 'ish-core/models/shipping-method/shipping-method.mapper';

import { Basket } from './basket.model';

export class BasketMapper {
  static fromData(payload: BasketData): Basket {
    const { data, included, infos } = payload;
    const totals = data.calculated
      ? BasketMapper.getTotals(data, included ? included.discounts : undefined)
      : undefined;

    if (totals) {
      totals.isEstimated = !data.invoiceToAddress || !data.commonShipToAddress || !data.commonShippingMethod;
    }

    const lineItems =
      included && included.lineItems && data.lineItems && data.lineItems.length
        ? data.lineItems
            .map(lineItemId => LineItemMapper.fromData(included.lineItems[lineItemId], included.lineItems_discounts))
            .map(item => {
              const camfilLineItem = included?.camfilProductLineItems?.[item.id];
              const earliestDeliveryDate = camfilLineItem?.productInfo?.earliestDeliveryDate;
              const listPrice = PriceItemMapper.fromPriceItem(camfilLineItem?.pricing?.listPrice);
              const salePrice = PriceItemMapper.fromPriceItem(camfilLineItem?.pricing?.salePrice);

              return {
                ...item,
                earliestDeliveryDate,
                listPrice,
                salePrice,
              };
            })
        : [];

    return {
      id: data.id,
      bucketId: data.buckets && data.buckets.length === 1 && data.buckets[0],
      buckets: data.buckets,
      basketExtensions: BasketMapper.getBasketExtensions(data.basketExtensions),
      purchaseCurrency: data.purchaseCurrency,
      dynamicMessages: data.discounts ? data.discounts.dynamicMessages : undefined,
      invoiceToAddress:
        included && included.invoiceToAddress && data.invoiceToAddress
          ? AddressMapper.fromData(included.invoiceToAddress[data.invoiceToAddress])
          : undefined,
      commonShipToAddress:
        included && included.commonShipToAddress && data.commonShipToAddress
          ? AddressMapper.fromData(included.commonShipToAddress[data.commonShipToAddress])
          : undefined,
      commonShippingMethod:
        included && included.commonShippingMethod && data.commonShippingMethod
          ? ShippingMethodMapper.fromData(included.commonShippingMethod[data.commonShippingMethod])
          : undefined,
      customerNo: data.customer,
      email: data.user,
      lineItems,
      totalProductQuantity: data.totalProductQuantity,
      payment:
        included?.payments && data.payments?.length && included.payments[data.payments[0]]
          ? PaymentMapper.fromIncludeData(
              included.payments[data.payments[0]],
              included.payments_paymentMethod &&
                included.payments_paymentMethod[included.payments[data.payments[0]].paymentMethod]
                ? included.payments_paymentMethod[included.payments[data.payments[0]].paymentMethod]
                : undefined,
              included.payments[data.payments[0]].paymentInstrument && included.payments_paymentInstrument
                ? included.payments_paymentInstrument[included.payments[data.payments[0]].paymentInstrument]
                : undefined
            )
          : undefined,
      promotionCodes: data.promotionCodes,
      totals,
      infos: infos && infos.filter(info => info.code !== 'include.not_resolved.error'),
      approval: data.approval,
      attributes: data.attributes,
      externalOrderReference: data.externalOrderReference,
    };
  }

  /**
   * Helper method to determine a basket(order) total on the base of row data.
   * @returns         The basket total.
   */
  static getTotals(data: BasketBaseData, discounts?: { [id: string]: BasketRebateData }): BasketTotal {
    const totalsData = data?.totals;

    return totalsData
      ? {
          itemTotal: PriceItemMapper.fromPriceItem(totalsData.itemTotal),
          undiscountedItemTotal: PriceItemMapper.fromPriceItem(totalsData.undiscountedItemTotal),
          shippingTotal: PriceItemMapper.fromPriceItem(totalsData.shippingTotal),
          undiscountedShippingTotal: PriceItemMapper.fromPriceItem(totalsData.undiscountedShippingTotal),
          paymentCostsTotal: PriceItemMapper.fromPriceItem(totalsData.paymentCostsTotal),
          dutiesAndSurchargesTotal: PriceItemMapper.fromPriceItem(totalsData.surchargeTotal),
          taxTotal: PriceItemMapper.fromSpecificPriceItem(totalsData.grandTotal, 'tax'),
          total: PriceItemMapper.fromPriceItem(totalsData.grandTotal),

          itemRebatesTotal: PriceItemMapper.fromPriceItem(totalsData.itemValueDiscountsTotal),
          valueRebatesTotal: PriceItemMapper.fromPriceItem(totalsData.basketValueDiscountsTotal),
          valueRebates:
            data.discounts && data.discounts.valueBasedDiscounts && discounts
              ? data.discounts.valueBasedDiscounts.map(discountId => BasketRebateMapper.fromData(discounts[discountId]))
              : undefined,

          itemShippingRebatesTotal: PriceItemMapper.fromPriceItem(totalsData.itemShippingDiscountsTotal),
          shippingRebatesTotal: PriceItemMapper.fromPriceItem(totalsData.basketShippingDiscountsTotal),
          shippingRebates:
            data.discounts && data.discounts.shippingBasedDiscounts && discounts
              ? data.discounts.shippingBasedDiscounts.map(discountId =>
                  BasketRebateMapper.fromData(discounts[discountId])
                )
              : undefined,

          itemSurchargeTotalsByType:
            data.surcharges && data.surcharges.itemSurcharges
              ? data.surcharges.itemSurcharges.map(surcharge => ({
                  amount: PriceItemMapper.fromPriceItem(surcharge.amount),
                  displayName: surcharge.name,
                  description: surcharge.description,
                }))
              : undefined,
          bucketSurchargeTotalsByType:
            data.surcharges && data.surcharges.bucketSurcharges
              ? data.surcharges.bucketSurcharges.map(surcharge => ({
                  amount: PriceItemMapper.fromPriceItem(surcharge.amount),
                  displayName: surcharge.name,
                  description: surcharge.description,
                }))
              : undefined,
          isEstimated: false,
        }
      : undefined;
  }

  static getAnonymousBasket(data: GuestBasketData): GuestBasket {
    const deliveryAddress = {
      streetAddress: data.dlvStreetAddress,
      zipCode: data.dlvZipCode,
      city: data.dlvCity,
      country: data.dlvCountry,
    };
    const invoiceAddress = {
      streetAddress: data.invStreetAddress,
      zipCode: data.invZipCode,
      city: data.invCity,
      country: data.invCountry,
    };
    return {
      userDetailsFormGroup: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.emailAddress,
        phone: data.phoneNumber,
        siret: data.siretNumber,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        vat: data.vatNumber,
      },
      deliveryInfoFromGroup: {
        boxLabel: data.dlvGoodsMark,
        invoiceMark: data.dlvInvoiceMark,
        deliveryInfo: data.dlvInfo,
        customerNote: data.dlvNote,
        streetAddress: data.dlvStreetAddress,
        zipCode: data.dlvZipCode,
        city: data.dlvCity,
        country: data.dlvCountry,
        sameAddressAsInvoice: BasketMapper.compareAddressFormGroups(deliveryAddress, invoiceAddress),
      },
      invoiceAddressFormGroup: {
        streetAddress: data.invStreetAddress,
        zipCode: data.invZipCode,
        city: data.invCity,
        country: data.invCountry,
      },
    };
  }

  static compareAddressFormGroups(deliveryAddress, invoiceAddress): boolean {
    return (
      deliveryAddress.streetAddress === invoiceAddress.streetAddress &&
      deliveryAddress.zipCode === invoiceAddress.zipCode &&
      deliveryAddress.city === invoiceAddress.city &&
      deliveryAddress.country === invoiceAddress.country
    );
  }

  static convertFormDataToAnonymousBasketData(data): GuestBasketData {
    const { userDetailsFormGroup, deliveryInfoFromGroup, invoiceAddressFormGroup } = data;
    const sameAsDelivery = deliveryInfoFromGroup.sameAddressAsInvoice;
    return {
      firstName: userDetailsFormGroup.firstName,
      lastName: userDetailsFormGroup.lastName,
      emailAddress: userDetailsFormGroup.email,
      phoneNumber: userDetailsFormGroup.phone,
      companyName: userDetailsFormGroup.companyName,
      vatNumber: userDetailsFormGroup.vat,
      siretNumber: userDetailsFormGroup.siret,
      jobTitle: userDetailsFormGroup.jobTitle,
      dlvGoodsMark: deliveryInfoFromGroup.boxLabel,
      dlvInvoiceMark: deliveryInfoFromGroup.invoiceMark,
      dlvInfo: deliveryInfoFromGroup.deliveryInfo,
      dlvNote: deliveryInfoFromGroup.customerNote,
      dlvStreetAddress: deliveryInfoFromGroup.streetAddress,
      dlvZipCode: deliveryInfoFromGroup.zipCode,
      dlvCity: deliveryInfoFromGroup.city,
      dlvCountry: deliveryInfoFromGroup.country,
      invStreetAddress: sameAsDelivery ? deliveryInfoFromGroup.streetAddress : invoiceAddressFormGroup.streetAddress,
      invZipCode: sameAsDelivery ? deliveryInfoFromGroup.zipCode : invoiceAddressFormGroup.zipCode,
      invCity: sameAsDelivery ? deliveryInfoFromGroup.city : invoiceAddressFormGroup.city,
      invCountry: sameAsDelivery ? deliveryInfoFromGroup.country : invoiceAddressFormGroup.country,
    };
  }

  static getBasketExtensions(data: BasketExtension[]): BasketExtension[] {
    const basketExtensions = data
      ?.map(extension => {
        delete extension.type;
        return Object.keys(extension)?.length ? extension : undefined;
      })
      .filter(Boolean);

    return basketExtensions?.length ? basketExtensions : undefined;
  }
}
