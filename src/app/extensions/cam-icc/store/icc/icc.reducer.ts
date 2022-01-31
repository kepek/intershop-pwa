import { createReducer, on } from '@ngrx/store';

import { applyIccConfiguration, setIccToken } from './icc.actions';

export interface ICCState {
  iccProxyURL: string;
  iccServer: string;
  iccToken: string;
  iccTokenHeaderKey: string;
}

const initialState: ICCState = {
  iccProxyURL: undefined,
  iccServer: undefined,
  iccToken: undefined,
  iccTokenHeaderKey: undefined,
};

export const iccReducer = createReducer(
  initialState,
  on(applyIccConfiguration, (state: ICCState, action) => {
    const { iccProxyURL, iccServer, iccToken, iccTokenHeaderKey } = action.payload;
    return { ...state, iccProxyURL, iccServer, iccToken, iccTokenHeaderKey };
  }),
  on(setIccToken, (state: ICCState, action) => {
    const { iccToken } = action.payload;
    return { ...state, iccToken };
  })
);
