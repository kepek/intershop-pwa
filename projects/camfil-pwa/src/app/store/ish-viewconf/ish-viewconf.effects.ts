import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { defer, fromEvent, iif } from 'rxjs';
import { distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';

import { setStickyHeader } from 'ish-core/store/core/viewconf/viewconf.actions';
import { ViewconfEffects } from 'ish-core/store/core/viewconf/viewconf.effects';
import { getScroll } from 'ish-core/store/core/viewconf/viewconf.selectors';

@Injectable()
export class IshViewconfEffects extends ViewconfEffects {
  constructor(
    store: Store,
    actions$: Actions,
    @Inject(PLATFORM_ID) platformId: string,
    private camfilStore: Store,
    // @ts-ignore // TODO (extMlk): remove @ts-ignore when in use
    private camfilActions$: Actions,
    @Inject(PLATFORM_ID) private camfilPlatformId: string
  ) {
    super(store, actions$, platformId);
  }

  toggleStickyHeader$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.camfilPlatformId),
      defer(() =>
        fromEvent(window, 'scroll').pipe(
          withLatestFrom(this.camfilStore.pipe(select(getScroll))),
          map(([, scroll]) => window.pageYOffset > scroll.position),
          map(scrollingDown => (scrollingDown ? window.pageYOffset >= 180 : window.pageYOffset >= 40)),
          distinctUntilChanged(),
          map(sticky => setStickyHeader({ sticky }))
        )
      )
    )
  );
}
