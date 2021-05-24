import { createSelector } from '@ngrx/store';

import { getCamIccState } from '../cam-icc-store';

const getIccState = createSelector(getCamIccState, state => state?.icc);

export const getICCProxyURL = createSelector(getIccState, state => state?.iccProxyURL);

export const getICCServerURL = createSelector(getIccState, state =>
  state?.iccServer ? `/${state.iccServer}`.replace(/\/+$/, '') : undefined
);

export const getIccRestEndpoint = getICCServerURL;
