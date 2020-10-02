import { createAction } from '@ngrx/store';

import { CamfilCustomerRegistrationType } from 'ish-core/models/camfil-customer/camfil-customer.model';
import { payload } from 'ish-core/utils/ngrx-creators';

export const camfilCreateUser = createAction('[User] Create User', payload<CamfilCustomerRegistrationType>());
