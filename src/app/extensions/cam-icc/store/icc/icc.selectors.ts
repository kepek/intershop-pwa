import { createSelector } from '@ngrx/store';

import { getCamIccState } from '../cam-icc-store';

const getIccState = createSelector(getCamIccState, state => state._icc);

export const getICCProxyURL = createSelector(getIccState, state => state.iccProxyURL);

export const getICCServerURL = createSelector(getIccState, state =>
  state.iccProxyURL && state.iccServer ? `${state.iccProxyURL}/${state.iccServer}` : undefined
);

export const getIccRestEndpoint = getICCServerURL;
