import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { CamfilCustomerRegistrationType } from '../../../models/camfil-customer/camfil-customer.model';

export const camfilCreateUser = createAction('[User] Create User', payload<CamfilCustomerRegistrationType>());
