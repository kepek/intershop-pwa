import { createSelector } from '@ngrx/store';
import { getCamfilPwaState } from 'camfil-pwa/store/camfil-pwa-store';

export const getCamfilIccState = createSelector(getCamfilPwaState, state => state.camfilIcc);

export const getICCProxyURL = createSelector(getCamfilIccState, state => state?.iccProxyURL);

export const getICCServerURL = createSelector(getCamfilIccState, state =>
  state?.iccServer ? `/${state.iccServer}`.replace(/\/+$/, '') : undefined
);

export const getIccRestEndpoint = getICCServerURL;
