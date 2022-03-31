import { TestBed } from '@angular/core/testing';

import { BasketTotalData } from 'ish-core/models/basket-total/basket-total.interface';

import { CamfilRequisitionBaseData } from './camfil-requisition.interface';
import { CamfilRequisitionMapper } from './camfil-requisition.mapper';

describe('Camfil Requisition Mapper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => CamfilRequisitionMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data = {
        id: 'testUUDI',
        basketId: 'testUUDI',
        requisitionNo: '0001',
        orderNo: '10001',
        calculated: false,
        invoiceToAddress: 'urn_invoiceToAddress_123',
        commonShipToAddress: 'urn_commonShipToAddress_123',
        commonShippingMethod: 'shipping_method_123',
        customer: 'OilCorp',
        user: 'bboldner@test.intershop.de',
        approvalCreationDate: '12-02-2022T:11:11:11',
        lineItemCount: 2,
        approvalStatus: {
          status: 'APPROVED',
          approver: { firstName: 'Bernhard', lastName: 'Boldner' },
          approvalDate: 76543627,
        },
        status: 'SUBMITTED',
        creator: { firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' },
        orderMark: 'Order mark',
        invoiceLabel: 'Invoice mark',
        userComment: 'Comment',
        phoneNumber: '123132132',
        userInformation: { firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' },
        userBudgets: {
          budgetPeriod: 'weekly',
          orderSpentLimit: { currency: 'USD', value: 500, type: 'Money' },
          budget: { currency: 'USD', value: 3000, type: 'Money' },
        },
        totals: {
          grandTotal: {
            gross: {
              value: 141796.98,
              currency: 'USD',
            },
            net: {
              value: 141796.98,
              currency: 'USD',
            },
            tax: {
              value: 543.65,
              currency: 'USD',
            },
          },
          itemTotal: {
            gross: {
              value: 141796.98,
              currency: 'USD',
            },
            net: {
              value: 141796.98,
              currency: 'USD',
            },
          },
        } as BasketTotalData,
      } as CamfilRequisitionBaseData;

      const mapped = CamfilRequisitionMapper.fromData({ data });
      expect(mapped).toMatchInlineSnapshot(`
        Object {
          "approval": Object {
            "status": "pending",
            "statusCode": "PENDING",
          },
          "attributes": undefined,
          "basketExtensions": undefined,
          "bucketId": undefined,
          "buckets": undefined,
          "commonShipToAddress": undefined,
          "commonShippingMethod": undefined,
          "creationDate": NaN,
          "customerNo": "OilCorp",
          "dynamicMessages": undefined,
          "email": "bboldner@test.intershop.de",
          "externalOrderReference": undefined,
          "id": "testUUDI",
          "info": undefined,
          "infos": undefined,
          "invoiceLabel": "Invoice mark",
          "invoiceToAddress": undefined,
          "lineItemCount": 2,
          "lineItems": Array [],
          "orderMark": "Order mark",
          "payment": undefined,
          "phoneNumber": "123132132",
          "promotionCodes": undefined,
          "purchaseCurrency": undefined,
          "requisitionCustomer": "OilCorp",
          "requisitionNo": "0001",
          "shippingAddress": undefined,
          "totalProductQuantity": undefined,
          "totals": Object {
            "bucketSurchargeTotalsByType": undefined,
            "discountTotal": undefined,
            "dutiesAndSurchargesTotal": undefined,
            "isEstimated": false,
            "itemRebatesTotal": undefined,
            "itemShippingRebatesTotal": undefined,
            "itemSurchargeTotalsByType": undefined,
            "itemTotal": Object {
              "currency": "USD",
              "gross": 141796.98,
              "net": 141796.98,
              "tax": undefined,
              "type": "PriceItem",
            },
            "paymentCostsTotal": undefined,
            "shippingRebates": undefined,
            "shippingRebatesTotal": undefined,
            "shippingTotal": undefined,
            "taxTotal": Object {
              "currency": "USD",
              "type": "Money",
              "value": 543.65,
            },
            "total": Object {
              "currency": "USD",
              "gross": 141796.98,
              "net": 141796.98,
              "tax": 543.65,
              "type": "PriceItem",
            },
            "undiscountedItemTotal": undefined,
            "undiscountedShippingTotal": undefined,
            "valueRebates": undefined,
            "valueRebatesTotal": undefined,
          },
          "user": Object {
            "email": "pmiller@test.intershop.de",
            "firstName": "Patricia",
            "lastName": "Miller",
          },
          "userBudget": Object {
            "budget": Object {
              "currency": "USD",
              "type": "Money",
              "value": 3000,
            },
            "budgetPeriod": "weekly",
            "orderSpentLimit": Object {
              "currency": "USD",
              "type": "Money",
              "value": 500,
            },
            "spentBudget": Object {
              "currency": "USD",
              "type": "Money",
              "value": 0,
            },
          },
          "userComment": "Comment",
        }
      `);
    });
  });
});
