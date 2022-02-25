import { createReducer, on } from '@ngrx/store';

import { applyIccConfiguration } from './camfil-icc.actions';

export interface CamfilICCState {
  iccProxyURL: string;
  iccServer: string;
  iccToken: string;
  iccTokenHeaderKey: string;
}

const initialState: CamfilICCState = {
  iccProxyURL: undefined,
  iccServer: undefined,
  iccToken: undefined,
  iccTokenHeaderKey: undefined,
};

export const camfilIccReducer = createReducer(
  initialState,
  on(applyIccConfiguration, (state: CamfilICCState, action) => {
    const { iccProxyURL, iccServer, iccToken, iccTokenHeaderKey } = action.payload;
    return { ...state, iccProxyURL, iccServer, iccToken, iccTokenHeaderKey };
  })
);
