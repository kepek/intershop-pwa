import { createSelector } from '@ngrx/store';

import { getCamIccState } from '../cam-icc-store';

const getIccState = createSelector(getCamIccState, state => state.icc);

export const getICCBaseURL = createSelector(getIccState, state => state.iccBaseURL);

export const getICCServerURL = createSelector(getIccState, state =>
  state.iccBaseURL && state.iccServer ? `${state.iccBaseURL}/${state.iccServer}` : undefined
);

export const getIccRestEndpoint = getICCServerURL;
