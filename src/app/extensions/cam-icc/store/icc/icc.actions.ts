import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { ICCState } from './icc.reducer';

type ICCType = Partial<ICCState>;

export const initIcc = createAction('[Camfil ICC] Init');

export const applyIccConfiguration = createAction('[Camfil ICC] Init ICC Configuration', payload<ICCType>());

export const setIccToken = createAction('[Camfil ICC] Set ICC Token', payload<{ iccToken: string }>());
