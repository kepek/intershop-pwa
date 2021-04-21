import { APP_BASE_HREF, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Channel } from 'ish-core/models/channel/channel.types';
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

  constructor(
    private appFacade: AppFacade,
    public location: Location,
    private router: Router,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {}

  ngOnInit() {
    this.locale$ = this.appFacade.currentLocale$;
    this.availableLocales$ = this.appFacade.availableLocales$;
    this.availableLocales$.pipe(whenTruthy(), take(1)).subscribe(availableLocales => {
      this.appFacade.getCamfilChannel$.pipe(take(1)).subscribe(channel => {
        const channelCode = Object.entries(Channel)
          .find(([, val]) => val === channel)[0]
          .toLowerCase();
        this.availableLocales = availableLocales.filter(loc => [channelCode, 'gb'].includes(loc.value));

        // TODO: tmp part
        this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe(event => {
          console.log(event.url, 'event.url');
          console.log(this.router.url, 'url');
          console.log(this.baseHref, 'baseHref');
          console.log(this.location.path(), 'location');
        });
      });
    });
  }

  toggleLevel(val: boolean) {
    this.isClosedLangList.emit(val);
  }

  getLanguageSwitchUrl(value: string) {
    const baseHrefArr = this.baseHref.split('/').filter(x => x);
    const locals = baseHrefArr[0]?.split('-');

    if (
      baseHrefArr[0]?.length === 5 && // ex.: sv-se
      locals.length === 2 && // ex.: ['sv', 'se']
      Object.keys(Channel).includes(locals[1].toLocaleUpperCase())
    ) {
      locals[1] = value;
      baseHrefArr[0] = locals.join('-');

      return `/${baseHrefArr.join('/')}${this.location.path()}`;
    }
    return false;
  }
}
