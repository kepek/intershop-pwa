import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Locale } from 'ish-core/models/locale/locale.model';

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

  constructor(private appFacade: AppFacade, public location: Location) {}

  ngOnInit() {
    this.locale$ = this.appFacade.currentLocale$;
    this.availableLocales$ = this.appFacade.availableLocales$;
  }

  toggleLevel(val: boolean) {
    this.isClosedLangList.emit(val);
  }
}
