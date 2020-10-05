import { CustomerRegistrationType } from 'ish-core/models/customer/customer.model';

import { RegistrationUser } from './registration-user.model';

export class RegistrationUserMapper {
  static fromData(user: RegistrationUser): CustomerRegistrationType {
    return user
      ? {
          credentials: {
            login: user.email,
            password: '',
          },
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            preferredLanguage: ''
          },
          customer: {
            customerNo: user.customerNo,
            companyName: user.customerName,
            // description: user.comment ?
            description: user.comment
          },
          address: {
            id: '',
            urn: '',
            addressName: '',
            firstName: '',
            lastName: '',
            addressLine1: '',
            postalCode: '',
            city: '',
            country: '',
            countryCode: '',
            phoneHome: '',
            invoiceToAddress: true,
            shipToAddress: true,
          }
        }
      : undefined;
  }
}
