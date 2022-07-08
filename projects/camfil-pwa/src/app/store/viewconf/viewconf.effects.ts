import { isPlatformBrowser } from '@angular/common';
import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { select } from '@ngrx/store';
import { defer, fromEvent, iif } from 'rxjs';
import { distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';

import { setStickyHeader } from 'ish-core/store/core/viewconf/viewconf.actions';
import { ViewconfEffects as IshViewconfEffects } from 'ish-core/store/core/viewconf/viewconf.effects';
import { getScroll } from 'ish-core/store/core/viewconf/viewconf.selectors';

@Injectable()
export class ViewconfEffects extends IshViewconfEffects {
  toggleStickyHeader$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      defer(() =>
        fromEvent(window, 'scroll').pipe(
          withLatestFrom(this.store.pipe(select(getScroll))),
          map(([, scroll]) => window.pageYOffset > scroll.position),
          map(scrollingDown => (scrollingDown ? window.pageYOffset >= 180 : window.pageYOffset >= 40)),
          distinctUntilChanged(),
          map(sticky => setStickyHeader({ sticky }))
        )
      )
    )
  );
}
