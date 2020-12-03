import { TestBed } from '@angular/core/testing';

import { CamfilB2bRoleData } from './camfil-b2b-role.interface';
import { CamfilB2bRoleMapper } from './camfil-b2b-role.mapper';

describe('Camfil B2b Role Mapper', () => {
  let b2bRoleMapper: CamfilB2bRoleMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    b2bRoleMapper = TestBed.inject(CamfilB2bRoleMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => b2bRoleMapper.fromData(undefined)).toThrow();
    });

    it('should map empty role response to empty roles data', () => {
      expect(b2bRoleMapper.fromData([])).toBeEmpty();
    });

    it('should map incoming data to model data', () => {
      const data = [
        {
          roleID: 'APP_B2B_BUYER',
          roleDisplayName: 'Buyer',
          roleDescription: 'The buyer manages own requisitions, order templates, quotes, orders and subscriptions.',
          fixed: true,
          permissions: [
            { permissionDisplayName: 'Assign a cost object to a basket' },
            { permissionDisplayName: 'Assign a cost object to a basket line item' },
            { permissionDisplayName: 'Create Quotes' },
          ],
        },
        {
          roleID: 'APP_B2B_APPROVER',
          roleDisplayName: 'Approver',
          fixed: false,
          permissions: [{ permissionDisplayName: 'Approve Pending Orders' }],
        },
      ] as CamfilB2bRoleData[];
      const mapped = b2bRoleMapper.fromData(data);
      expect(mapped).toMatchInlineSnapshot(`
        Array [
          Object {
            "description": "The buyer manages own requisitions, order templates, quotes, orders and subscriptions.",
            "displayName": "Buyer",
            "fixed": true,
            "id": "APP_B2B_BUYER",
            "permissionDisplayNames": Array [
              "Assign a cost object to a basket",
              "Assign a cost object to a basket line item",
              "Create Quotes",
            ],
          },
          Object {
            "description": undefined,
            "displayName": "Approver",
            "fixed": false,
            "id": "APP_B2B_APPROVER",
            "permissionDisplayNames": Array [
              "Approve Pending Orders",
            ],
          },
        ]
      `);
    });
  });
});
