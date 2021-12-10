import { Injectable } from '@angular/core';
import * as camelcaseKeys from 'camelcase-keys';
import { GuestAttributePrefix, GuestBuyer } from 'camfil-pwa/models/order/order.interface';

import { AddressData } from 'ish-core/models/address/address.interface';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { OrderData } from 'ish-core/models/order/order.interface';
import { OrderMapper as IshOrderMapper } from 'ish-core/models/order/order.mapper';
import { Order } from 'ish-core/models/order/order.model';

export function omitCustomGuestAttributes(attributes: Attribute[]) {
  return attributes?.filter(
    attr =>
      !attr?.name?.startsWith(GuestAttributePrefix.CustomerId) &&
      !attr?.name?.startsWith(GuestAttributePrefix.DeliveryDate) &&
      !attr?.name?.startsWith(GuestAttributePrefix.ErpId) &&
      !attr?.name?.startsWith(GuestAttributePrefix.EmailRecipients) &&
      !attr?.name?.startsWith(GuestAttributePrefix.InvoiceAddress) &&
      !attr?.name?.startsWith(GuestAttributePrefix.ShippingAddress) &&
      !attr?.name?.startsWith(GuestAttributePrefix.VolumeDiscount)
  );
}

@Injectable({ providedIn: 'root' })
export class OrderMapper extends IshOrderMapper {
  static fromData(payload: OrderData): Order {
    if (OrderMapper.isGuestOrder(payload)) {
      return OrderMapper.fromGuestData(payload);
    }

    return IshOrderMapper.fromData(payload);
  }

  static fromListData(payload: OrderData): Order[] {
    if (Array.isArray(payload.data)) {
      return payload.data.map(data => OrderMapper.fromData({ ...payload, data }));
    }
  }

  static orderDataDestructor(payload: OrderData) {
    if (!Array.isArray(payload.data)) {
      const { data, included, infos } = payload;
      return { data, included, infos };
    }
  }

  static fromGuestData(orderData: OrderData): Order {
    const payload = OrderMapper.orderDataDestructor(orderData);
    const customerId = OrderMapper.getGuestOrderAttribute(orderData, GuestAttributePrefix.CustomerId)?.value as string;
    const taxationIDAttr = OrderMapper.getGuestOrderAttribute(orderData, GuestAttributePrefix.TaxationID, 'taxationID');
    const invoiceToAddress = OrderMapper.getInvoiceToAddressFromGuestData(orderData);
    const commonShipToAddress = OrderMapper.getCommonShipToAddressFromGuestData(orderData);

    if (payload) {
      const { data, included, infos } = payload;

      data.attributes = data?.attributes || [];
      data.attributes.push(taxationIDAttr);
      data.attributes = omitCustomGuestAttributes(data.attributes);
      data.attributes = [...new Set([...data.attributes])];
      data.attributes = data.attributes.filter(attr => !attr?.name?.startsWith(GuestAttributePrefix.Default));

      data.invoiceToAddress = customerId;
      data.commonShipToAddress = customerId;

      included.invoiceToAddress = invoiceToAddress;
      included.commonShipToAddress = commonShipToAddress;

      const guestPayload: OrderData = { data, included, infos };

      return IshOrderMapper.fromData(guestPayload);
    }
  }

  static getGuestOrderAttribute(orderData: OrderData, prefix: GuestAttributePrefix, newName?: string): Attribute {
    const payload = OrderMapper.orderDataDestructor(orderData);

    if (payload && prefix) {
      const attribute = payload?.data?.attributes?.find(attr => attr?.name.startsWith(prefix));

      if (!attribute) {
        return;
      }

      if (newName?.length) {
        attribute.name = newName;
      }

      return attribute;
    }
  }

  static getCommonShipToAddressAttributes(orderData: OrderData): Attribute[] {
    const payload = OrderMapper.orderDataDestructor(orderData);

    if (payload) {
      const { data } = payload;
      const { attributes } = data;

      return attributes.filter(attr => attr?.name?.startsWith(GuestAttributePrefix.ShippingAddress));
    }
  }

  static getCommonShipToAddressFromGuestData(orderData: OrderData): { [urn: string]: AddressData } {
    const buyer = OrderMapper.getBuyerFromGuestData(orderData);
    const shippingAttributes = OrderMapper.getCommonShipToAddressAttributes(orderData);
    const customerId = OrderMapper.getGuestOrderAttribute(orderData, GuestAttributePrefix.CustomerId)?.value as string;

    if (!buyer || !shippingAttributes || !customerId) {
      return;
    }

    const commonShipToAddress: { [urn: string]: AddressData } = {};

    const address = shippingAttributes.reduce<AddressData>((acc, { name, value }) => {
      const rawName = name?.replace(GuestAttributePrefix.ShippingAddress, '');
      let addressKey = rawName as keyof AddressData;

      if (rawName && value) {
        switch (rawName) {
          case 'STREET_ADDRESS':
            addressKey = 'addressLine1';
            break;
          case 'ZIP_CODE':
            addressKey = 'postalCode';
            break;
        }

        acc.id = customerId;
        acc.urn = customerId;
        // @ts-ignore
        acc[addressKey] = value;
      }

      return camelcaseKeys(acc);
      // tslint:disable-next-line:ish-no-object-literal-type-assertion
    }, {} as AddressData);

    commonShipToAddress[customerId] = { ...buyer, ...address };

    return commonShipToAddress;
  }

  static getInvoiceToAddressAttributes(orderData: OrderData): Attribute[] {
    const payload = OrderMapper.orderDataDestructor(orderData);

    if (payload) {
      const { data } = payload;
      const { attributes } = data;

      return attributes.filter(attr => attr?.name?.startsWith(GuestAttributePrefix.InvoiceAddress));
    }
  }

  static getInvoiceToAddressFromGuestData(orderData: OrderData): { [urn: string]: AddressData } {
    const buyer = OrderMapper.getBuyerFromGuestData(orderData);
    const invoiceAttributes = OrderMapper.getInvoiceToAddressAttributes(orderData);
    const customerId = OrderMapper.getGuestOrderAttribute(orderData, GuestAttributePrefix.CustomerId)?.value as string;

    if (!buyer || !invoiceAttributes || !customerId) {
      return;
    }

    const invoiceToAddress: { [urn: string]: AddressData } = {};

    const address = invoiceAttributes.reduce<AddressData>((acc, { name, value }) => {
      const rawName = name?.replace(GuestAttributePrefix.InvoiceAddress, '');
      let addressKey = rawName as keyof AddressData;

      if (rawName && value) {
        switch (rawName) {
          case 'STREET_ADDRESS':
            addressKey = 'addressLine1';
            break;
          case 'ZIP_CODE':
            addressKey = 'postalCode';
            break;
        }

        acc.id = customerId;
        acc.urn = customerId;
        // @ts-ignore
        acc[addressKey] = value;
      }

      return camelcaseKeys(acc);
      // tslint:disable-next-line:ish-no-object-literal-type-assertion
    }, {} as AddressData);

    invoiceToAddress[customerId] = { ...buyer, ...address };

    return invoiceToAddress;
  }

  static isGuestOrder(orderData: OrderData): boolean {
    const payload = OrderMapper.orderDataDestructor(orderData);

    if (payload) {
      return (
        payload?.data?.attributes?.filter(attr => attr?.name?.startsWith(GuestAttributePrefix.Default))?.length > 0
      );
    }
  }

  static getBuyerFromGuestData(orderData: OrderData): GuestBuyer {
    const payload = OrderMapper.orderDataDestructor(orderData);

    if (payload) {
      const { data } = payload;
      const { attributes } = data;

      return omitCustomGuestAttributes(attributes).reduce<GuestBuyer>((acc, { name, value }) => {
        const rawName = name?.replace(GuestAttributePrefix.Default, '');
        let addressKey = rawName as keyof GuestBuyer;

        if (rawName && value) {
          switch (rawName) {
            case 'COMPANY_NAME':
              addressKey = 'companyName1';
              break;
            case 'EMAIL_ADDRESS':
              addressKey = 'email';
              break;
            case 'PHONE_NUMBER':
              addressKey = 'phoneHome';
              break;
            case 'STREET_NUMBER':
              addressKey = 'addressLine2';
              break;
            case 'VAT_NUMBER':
              addressKey = 'taxationID';
              break;
          }

          delete acc?.goodsMark;
          delete acc?.jobTitle;
          delete acc?.info;
          delete acc?.origin;

          // @ts-ignore
          acc[addressKey] = value;
        }

        return camelcaseKeys(acc);
      }, {});
    }
  }
}
