import { DefaultUrlSerializer, UrlTree } from '@angular/router';
import * as qs from 'qs';

export class CamUrlSerializer implements CamUrlSerializer {
  static QUERY_PARAMS_PREFIX = '?';

  private dus = new DefaultUrlSerializer();

  static stringifyToQs(obj: {}): string {
    return qs.stringify(obj, { encode: false, arrayFormat: 'indices' });
  }

  static parseQs(str: string): qs.ParsedQs {
    let queryString: string = str;

    if (queryString.includes(CamUrlSerializer.QUERY_PARAMS_PREFIX)) {
      queryString = queryString.split(CamUrlSerializer.QUERY_PARAMS_PREFIX)[1];
    }

    return qs.parse(queryString, { arrayLimit: 0, parseArrays: false });
  }

  parse(url: string): UrlTree {
    const newUrl = decodeURIComponent(url);
    return this.dus.parse(newUrl);
  }

  serialize(tree: UrlTree): string {
    return this.dus.serialize(tree);
  }
}
