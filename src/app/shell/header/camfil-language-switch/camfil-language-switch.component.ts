import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'camfil-language-switch',
  templateUrl: './camfil-language-switch.component.html',
  styleUrls: ['./camfil-language-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilLanguageSwitchComponent implements OnInit {
  @Input() view: '' | 'onMobile' | 'accordion' = '';
  /**
   * determines position of dropbox - dropup or dropdown, default is dropdown
   */
  @Input() placement: '' | 'up' = '';
  @Output() isClosedLangList = new EventEmitter<boolean>();
  showList = false;

  locale$: Observable<Locale>;
  availableLocales$: Observable<Locale[]>;
  availableLocales: Locale[];

  constructor(private appFacade: AppFacade, public location: Location) {}

  ngOnInit() {
    this.locale$ = this.appFacade.currentLocale$;
    this.availableLocales$ = this.appFacade.availableLocales$;
    this.availableLocales$.pipe(whenTruthy(), take(1)).subscribe(availableLocales => {
      this.appFacade.getCountryByChannel$.pipe(take(1)).subscribe(code => {
        this.availableLocales = availableLocales.filter(loc => [code.toLowerCase(), 'gb'].includes(loc.value));
      });
    });
  }

  toggleLevel(val: boolean) {
    this.isClosedLangList.emit(val);
  }
}
