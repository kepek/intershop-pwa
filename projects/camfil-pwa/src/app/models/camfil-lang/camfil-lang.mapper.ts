import { Injectable } from '@angular/core';

import { CamfilLangData, CamfilLangPayload, CamfilLangSubject } from './camfil-lang.model';

@Injectable({ providedIn: 'root' })
export class CamfilLangMapper {
  static fromData(langData: CamfilLangData): CamfilLangPayload {
    if (!langData) {
      throw new Error(`langData is required`);
    }

    return { lang: langData?.languageCode };
  }

  static toData(langPayload: CamfilLangPayload | CamfilLangSubject): CamfilLangData {
    if (!langPayload) {
      throw new Error(`langPayload is required`);
    }

    return { languageCode: langPayload?.lang };
  }
}
