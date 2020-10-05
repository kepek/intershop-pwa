import { RegistrationUserMapper } from 'ish-core/models/user/registration-user.mapper';
import { RegistrationUser } from 'ish-core/models/user/registration-user.model';

describe('Registration User Mapper', () => {
  describe('fromData', () => {
    it(`should return CustomerRegistrationType when getting RegistrationUser`, () => {
      const userData = {
        firstName: 'Patricia',
        lastName: 'Miller',
        email: 'test@test.com',
        customerName: 'customerName',
        customerNo: 'customerNo',
      } as RegistrationUser;
      const user = RegistrationUserMapper.fromData(userData);

      expect(user).toBeTruthy();
      expect(user.credentials.login).toBe(userData.email);
      expect(user.user.firstName).toBe(userData.firstName);
      expect(user.user.lastName).toBe(userData.lastName);
      expect(user.user.email).toBe(userData.email);
      expect(user.customer.companyName).toBe(userData.customerName);
      expect(user.customer.customerNo).toBe(userData.customerNo);
    });
  });
});
