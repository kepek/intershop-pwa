import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';

@Injectable({ providedIn: 'root' })
export class CamfilUrlService {
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    @Optional() @Inject(REQUEST) private request: Request,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {}

  getBaseURL(includeBaseHref: boolean) {
    let url: string;

    if (this.request) {
      url = `${this.request.protocol}://${this.request.get('host')}${includeBaseHref ? this.baseHref : ''}`;
    } else {
      url = includeBaseHref ? this.doc.baseURI : this.doc.baseURI.replace(new RegExp(`${this.baseHref}$`), '');
    }

    return new URL(url)?.toString()?.replace(/\/$/, '');
  }
}
