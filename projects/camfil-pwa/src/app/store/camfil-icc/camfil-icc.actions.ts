import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { CamfilICCState } from './camfil-icc.reducer';

type CamfilICCType = Partial<CamfilICCState>;

export const initIcc = createAction('[Camfil ICC] Init');

export const applyIccConfiguration = createAction('[Camfil ICC] Apply ICC Configuration', payload<CamfilICCType>());
