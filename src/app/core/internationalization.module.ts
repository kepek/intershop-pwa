import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localeFi from '@angular/common/locales/fi';
import localeFr from '@angular/common/locales/fr';
import localeSv from '@angular/common/locales/sv';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatDateFormats } from '@angular/material/core';
import { TransferState } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { take } from 'rxjs/operators';

import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { mapToProperty } from 'ish-core/utils/operators';

import { SSR_LOCALE } from './configurations/state-keys';

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

  constructor(
    @Inject(LOCALE_ID) lang: string,
    translateService: TranslateService,
    store: Store,
    private transferState: TransferState
  ) {
    [localeFi, localeFr, localeSv].map(registerLocaleData);

    store.pipe(select(getCurrentLocale), mapToProperty('lang'), take(1)).subscribe(currentLang => {
      this.lang = currentLang?.replace(/-/, '_') || lang;
      if (this.transferState.hasKey(SSR_LOCALE)) {
        this.lang = this.transferState.get(SSR_LOCALE, this.lang);
        // tslint:disable-next-line: no-console
        console.log(this.lang, 'SSR_LOCALE');
      }
      translateService.setDefaultLang(this.lang.replace(/-/, '_'));
      translateService.use(this.lang);
    });
  }

  get lang(): string {
    return this.langValue;
  }

  set lang(value: string) {
    this.langValue = value;
  }
}
