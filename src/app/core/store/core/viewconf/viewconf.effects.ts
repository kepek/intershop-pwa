import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction, routerRequestAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { defer, fromEvent, iif } from 'rxjs';
import {
  bufferToggle,
  concatMap,
  delay,
  distinctUntilChanged,
  filter,
  first,
  map,
  withLatestFrom,
} from 'rxjs/operators';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { selectRouteData } from 'ish-core/store/core/router';
import { getScroll } from 'ish-core/store/core/viewconf/viewconf.selectors';
import { whenTruthy } from 'ish-core/utils/operators';

import { setBreadcrumbData, setScroll, setStickyHeader } from './viewconf.actions';

@Injectable()
export class ViewconfEffects {
  constructor(protected store: Store, protected actions$: Actions, @Inject(PLATFORM_ID) protected platformId: string) {}

  toggleStickyHeader$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      defer(() =>
        fromEvent(window, 'scroll').pipe(
          map(() => window.pageYOffset >= 180),
          distinctUntilChanged(),
          map(sticky => setStickyHeader({ sticky }))
        )
      )
    )
  );

  toggleScroll$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      defer(() =>
        fromEvent(window, 'scroll').pipe(
          withLatestFrom(this.store.pipe(select(getScroll))),
          map(([, { position }]) => {
            const scroll = window.pageYOffset;
            const scrollDown = scroll >= 180 && position < scroll;
            return { scroll, scrollDown };
          }),
          distinctUntilChanged(),
          map(({ scroll, scrollDown }) =>
            setScroll({
              position: scroll,
              isDown: scrollDown,
            })
          )
        )
      )
    )
  );

  retrieveBreadcrumbDataFromRouting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setBreadcrumbData),
      // collect all breadcrumb actions during routing
      bufferToggle(this.actions$.pipe(ofType(routerRequestAction)), () =>
        this.actions$.pipe(ofType(routerNavigatedAction), delay(100))
      ),
      // if no breadcrumb was set with effects
      filter(actions => !actions.length),
      concatMap(() =>
        // set the current one from the routing (if available)
        this.store.pipe(
          select(selectRouteData<BreadcrumbItem[]>('breadcrumbData')),
          first(),
          whenTruthy(),
          map(breadcrumbData => setBreadcrumbData({ breadcrumbData }))
        )
      )
    )
  );
}
