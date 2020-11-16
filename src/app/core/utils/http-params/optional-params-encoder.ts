// tslint:disable: ish-ordered-imports ban-specific-imports
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { isDate, isObject, isUndefined } from 'lodash-es';

export class OptionalParamsEncoder extends HttpUrlEncodingCodec {
  encodeKey(k: string): string {
    return encodeURIComponent(k);
  }

  encodeValue(v): string {
    return encodeURIComponent(this.serializeValue(v));
  }

  serializeValue(v) {
    if (isObject(v)) {
      return isDate(v) ? v.toISOString() : JSON.stringify(v);
    }
    if (v === null || isUndefined(v)) {
      return '';
    }
    return v;
  }
}
