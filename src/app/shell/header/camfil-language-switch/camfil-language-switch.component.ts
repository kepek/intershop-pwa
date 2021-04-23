import { APP_BASE_HREF, DOCUMENT, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Channel } from 'ish-core/models/channel/channel.types';
import { Locale } from 'ish-core/models/locale/locale.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { lookup } from 'dns';

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
    @Inject(DOCUMENT) private doc: Document,
    @Optional() @Inject(REQUEST) private request: Request,
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
      });
    });
  }

  toggleLevel(val: boolean) {
    this.isClosedLangList.emit(val);
  }

  getLanguageSwitchUrl(value: string) {
    let url = this.doc.baseURI.replace(new RegExp(`${this.baseHref}$`), '');

    if (this.request) {
      url = `${this.request.protocol}://${this.request.get('host')}`;
    }

    const baseHrefArr = this.baseHref.split('/').filter(x => x);
    const locals = baseHrefArr[0]?.split('-');

    if (
      baseHrefArr[0]?.length === 5 && // ex.: sv-se
      locals.length === 2 && // ex.: ['sv', 'se']
      this.availableLocales.find(loc => loc.value === locals[1])
    ) {
      locals[1] = value;
      baseHrefArr[0] = locals.join('-');

      return `${url}/${baseHrefArr.join('/')}${this.location.path()}`;
    }
    return false;
  }
}
