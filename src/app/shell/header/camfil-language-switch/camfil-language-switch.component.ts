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

import { CamfilConfigurationFacade } from '../../../extensions/cam-configuration/facades/camfil-configuration.facade';
import { CamfilLang } from '../../../extensions/cam-configuration/models/channel-configuration/channel-configuration.model';

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
  languages$: Observable<CamfilLang[]>;

  constructor(
    private appFacade: AppFacade,
    public location: Location,
    private camfilConfigurationFacade: CamfilConfigurationFacade,
    @Inject(DOCUMENT) private doc: Document,
    @Optional() @Inject(REQUEST) private request: Request,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {}

  ngOnInit() {
    this.locale$ = this.appFacade.currentLocale$;
    this.languages$ = this.camfilConfigurationFacade.languages$;
  }

  toggleLevel(val: boolean) {
    this.isClosedLangList.emit(val);
  }

  getBaseUrl(urlParams: { [key: string]: string }) {
    const baseURL = this.baseURL(true);
    const splitPath = this.location?.path()?.split('?');
    const queryParams = splitPath[1];

    let url = baseURL.toString().replace(/\/+$/, '');
    let path = splitPath[0];

    if (baseURL instanceof URL) {
      path = path?.replace(/^\/+/, '');
    }

    if (urlParams) {
      path += Object.keys(urlParams)
        .map(k => `;${k}=${urlParams[k]}`)
        .join('');
    }

    url = [url, path].filter(Boolean).join('/');

    if (splitPath.length > 1) {
      url += `?${queryParams}`;
    }

    return url;
  }

  private baseURL(includeBaseHref: boolean) {
    let url: string;

    if (this.request) {
      url = `${this.request.protocol}://${this.request.get('host')}${includeBaseHref ? this.baseHref : ''}`;
    } else {
      url = includeBaseHref ? this.doc.baseURI : this.doc.baseURI.replace(new RegExp(`${this.baseHref}$`), '');
    }

    return new URL(url);
  }

  changeLocale(event: MouseEvent, lang: string) {
    event.preventDefault();

    this.appFacade.setCurrentLocale$(lang);
  }
}
