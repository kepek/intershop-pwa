import { Address } from 'ish-core/models/address/address.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { CamfilB2bUserData } from './camfil-b2b-user.interface';
import { CamfilB2bUserMapper } from './camfil-b2b-user.mapper';

describe('Camfil B2b User Mapper', () => {
  describe('fromData', () => {
    it(`should return User when getting UserData`, () => {
      const userData = {
        firstName: 'Patricia',
        lastName: 'Miller',
        preferredInvoiceToAddress: BasketMockData.getAddress(),
        preferredShipToAddress: { urn: 'urn:1234' } as Address,
        preferredPaymentInstrument: { id: '1234' } as PaymentInstrument,
        active: true,
      } as CamfilB2bUserData;
      const user = CamfilB2bUserMapper.fromData(userData);

      expect(user).toMatchInlineSnapshot(`
        Object {
          "active": true,
          "currentLogin": undefined,
          "firstName": "Patricia",
          "lastName": "Miller",
          "preferredInvoiceToAddress": Object {
            "addressLine1": "Potsdamer Str. 20",
            "addressName": "customeraddr-ABCDEFGPRMuMCscyXgSRVU",
            "city": "Berlin",
            "country": "Germany",
            "countryCode": "DE",
            "email": "patricia@test.intershop.de",
            "firstName": "Patricia",
            "id": "ilMKAE8BlIUAAAFgEdAd1LZU",
            "invoiceToAddress": true,
            "lastName": "Miller",
            "phoneHome": "049364112677",
            "postalCode": "14483",
            "shipFromAddress": false,
            "shipToAddress": true,
            "title": "Ms.",
            "urn": "urn:address:customer:JgEKAE8BA50AAAFgDtAd1LZU:ilMKAE8BlIUAAAFgEdAd1LZU",
            "usage": Array [
              true,
              true,
            ],
          },
          "preferredPaymentInstrument": Object {
            "id": "1234",
          },
          "preferredShipToAddress": Object {
            "urn": "urn:1234",
          },
          "roleIDs": undefined,
        }
      `);
    });
  });

  describe('fromListData', () => {
    it(`should return User when getting UserListData`, () => {
      const userListData = [{ id: '1', login: 'pmiller@test.intershop.de' } as CamfilB2bUserData];
      const users = CamfilB2bUserMapper.fromListData(userListData);

      expect(users).toMatchInlineSnapshot(`
        Array [
          Object {
            "active": undefined,
            "currentLogin": "pmiller@test.intershop.de",
            "id": "1",
            "login": "pmiller@test.intershop.de",
            "roleIDs": undefined,
          },
        ]
      `);
    });
  });
});
