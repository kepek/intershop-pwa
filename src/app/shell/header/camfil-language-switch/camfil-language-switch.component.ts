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
  availableLocalesByCountryCode$: Observable<Locale[]>;

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
    this.availableLocalesByCountryCode$ = this.appFacade.availableLocalesByCountryCode$;
  }

  toggleLevel(val: boolean) {
    this.isClosedLangList.emit(val);
  }

  getLanguageSwitchUrl(value: string = '', includeBaseHref = false) {
    let url: string;

    if (this.request) {
      url = `${this.request.protocol}://${this.request.get('host')}${includeBaseHref ? this.baseHref : ''}`;
    } else {
      url = includeBaseHref ? this.doc.baseURI : this.doc.baseURI.replace(new RegExp(`${this.baseHref}$`), '');
    }

    return [url, value, this.location.path()].filter(Boolean).join('/');
  }

  getBaseUrl() {
    return this.baseURL(true);
  }

  private baseURL(includeBaseHref: boolean) {
    let url: string;
    if (this.request) {
      url = `${this.request.protocol}://${this.request.get('host')}${includeBaseHref ? this.baseHref : ''}`;
    } else {
      url = includeBaseHref ? this.doc.baseURI : this.doc.baseURI.replace(new RegExp(`${this.baseHref}$`), '');
    }
    return url.endsWith('/') ? url : url + '/';
  }
}
