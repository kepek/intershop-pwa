import { Injectable } from '@angular/core';

import { LangData, LangPayload, LangSubject } from './lang.model';

@Injectable({ providedIn: 'root' })
export class LangMapper {
  static fromData(langData: LangData): LangPayload {
    if (!langData) {
      throw new Error(`langData is required`);
    }

    return { lang: langData?.languageCode };
  }

  static toData(langPayload: LangPayload | LangSubject): LangData {
    if (!langPayload) {
      throw new Error(`langPayload is required`);
    }

    return { languageCode: langPayload?.lang };
  }
}
