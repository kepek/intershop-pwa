import { Location } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { Channel } from 'ish-core/models/channel/channel.types';

@Pipe({ name: 'makeHref', pure: false })
export class MakeHrefPipe implements PipeTransform {
  transform(location: Location, urlParams: { [key: string]: string }): string {
    if (!location || !location.path()) {
      return 'undefined';
    }

    const split = location.path().split('?');

    // url without query params
    let newUrl = split[0];

    // for change language only
    const splitUrl = newUrl.split('/').filter(x => x);
    const splitLocal = splitUrl[0]?.split('-') || [];

    if (this.isChannelContextPath(splitUrl, splitLocal, urlParams?.value)) {
      splitLocal[1] = urlParams.value;
      splitUrl[0] = splitLocal.join('-');
      return splitUrl.join('/') + (split.length > 1 ? `?${split[1]}` : '');
    }

    // add supplied url params
    if (urlParams) {
      newUrl += Object.keys(urlParams)
        .filter(k => k !== 'value')
        .map(k => `;${k}=${urlParams[k]}`)
        .join('');
    }

    // add query params at the end
    if (split.length > 1) {
      newUrl += `?${split[1]}`;
    }

    return newUrl;
  }

  isChannelContextPath(url: string[], local: string[], value: string) {
    return (
      url[0]?.length === 5 && // ex.: sv-se
      local.length === 2 && // ex.: ['sv', 'se']
      Object.keys(Channel).includes(local[1].toLocaleUpperCase()) &&
      value
    );
  }
}
