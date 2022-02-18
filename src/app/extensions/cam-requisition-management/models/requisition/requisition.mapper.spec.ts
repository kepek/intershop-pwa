import { TestBed } from '@angular/core/testing';

import { RequisitionBaseData } from './requisition.interface';
import { RequisitionMapper } from './requisition.mapper';

describe('Requisition Mapper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => RequisitionMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data = {
        id: 'testUUDI',
        requisitionNo: '0001',
        orderNo: '10001',
        invoiceToAddress: 'urn_invoiceToAddress_123',
        commonShipToAddress: 'urn_commonShipToAddress_123',
        commonShippingMethod: 'shipping_method_123',
        customer: 'OilCorp',
        user: 'bboldner@test.intershop.de',
        creationDate: '12-02-2022T:11:11:11',
        lineItemCount: 2,
        approvalStatus: {
          status: 'APPROVED',
          approver: { firstName: 'Bernhard', lastName: 'Boldner' },
          approvalDate: 76543627,
        },
        userInformation: { firstName: 'Patricia', lastName: 'Miller', email: 'pmiller@test.intershop.de' },
        userBudgets: {
          budgetPeriod: 'weekly',
          orderSpentLimit: { currency: 'USD', value: 500, type: 'Money' },
          budget: { currency: 'USD', value: 3000, type: 'Money' },
        },
        totals: {},
      } as RequisitionBaseData;

      const mapped = RequisitionMapper.fromData({ data });
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
          "creationDate": 1644620400000,
          "customerNo": "OilCorp",
          "dynamicMessages": undefined,
          "email": "bboldner@test.intershop.de",
          "externalOrderReference": undefined,
          "id": "testUUDI",
          "infos": undefined,
          "invoiceToAddress": undefined,
          "lineItemCount": 2,
          "lineItems": Array [],
          "orderNo": "10001",
          "payment": undefined,
          "promotionCodes": undefined,
          "purchaseCurrency": undefined,
          "requisitionNo": "0001",
          "totalProductQuantity": undefined,
          "totals": Object {
            "bucketSurchargeTotalsByType": undefined,
            "discountTotal": undefined,
            "dutiesAndSurchargesTotal": undefined,
            "isEstimated": false,
            "itemRebatesTotal": undefined,
            "itemShippingRebatesTotal": undefined,
            "itemSurchargeTotalsByType": undefined,
            "itemTotal": undefined,
            "paymentCostsTotal": undefined,
            "shippingRebates": undefined,
            "shippingRebatesTotal": undefined,
            "shippingTotal": undefined,
            "taxTotal": undefined,
            "total": undefined,
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
        }
      `);
    });
  });
});
