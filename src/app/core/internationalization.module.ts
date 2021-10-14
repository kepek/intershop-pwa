import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localeFi from '@angular/common/locales/fi';
import localeFr from '@angular/common/locales/fr';
import localeSv from '@angular/common/locales/sv';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatDateFormats } from '@angular/material/core';
import { select, Store } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { take } from 'rxjs/operators';

import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { mapToProperty } from 'ish-core/utils/operators';

export function translateFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export const CAMFIL_DEFAULT_LANG = 'en-US';

export const CAMFIL_FORMATS: MatDateFormats = {
  ...MAT_MOMENT_DATE_FORMATS,
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class InternationalizationModule {
  private langValue = CAMFIL_DEFAULT_LANG;

  constructor(@Inject(LOCALE_ID) lang: string, translateService: TranslateService, store: Store) {
    [localeFi, localeFr, localeSv].map(registerLocaleData);

    store
      .pipe(select(getCurrentLocale), mapToProperty('lang'), take(1))
      .subscribe(currentLang => (this.lang = currentLang?.replace(/_/, '-') || lang));

    translateService.setDefaultLang(this.lang.replace(/-/, '_'));
  }

  get lang(): string {
    return this.langValue;
  }

  set lang(value: string) {
    this.langValue = value;
  }
}
