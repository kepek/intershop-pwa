import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
  NativeDateAdapter,
} from '@angular/material/core';

export const CAMFIL_FORMATS: MatDateFormats = {
  ...MAT_MOMENT_DATE_FORMATS,
  parse: {
    dateInput: 'L',
  },
};

export const DATAPICKER_PROVIDERS_FORMAT = [
  // TODO: improve value, should be dynamic
  { provide: MAT_DATE_LOCALE, useValue: 'sv-SE' },
  {
    provide: DateAdapter,
    useClass: NativeDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  },
  { provide: MAT_DATE_FORMATS, useValue: CAMFIL_FORMATS },
];
