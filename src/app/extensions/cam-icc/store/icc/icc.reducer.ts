import { createReducer, on } from '@ngrx/store';

import { applyIccConfiguration, setIccToken } from './icc.actions';

export interface ICCState {
  iccBaseURL: string;
  iccServer: string;
  iccToken: string;
  iccTokenHeaderKey: string;
}

const initialState: ICCState = {
  iccBaseURL: undefined,
  iccServer: undefined,
  iccToken: undefined,
  iccTokenHeaderKey: undefined,
};

export const iccReducer = createReducer(
  initialState,
  on(applyIccConfiguration, (state: ICCState, action) => ({ ...state, ...action.payload })),
  on(setIccToken, (state: ICCState, action) => {
    const { iccToken } = action.payload;
    return { ...state, iccToken };
  })
);
