import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { identity } from 'rxjs';
import { groupBy, map, mapTo, mergeMap, switchMap, take, tap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { setCurrentLocale } from 'ish-core/store/core/configuration';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  flushCmsData,
  loadContentInclude,
  loadContentIncludeFail,
  loadContentIncludeSuccess,
} from './includes.actions';
import { getAllContentIncludeIds } from './includes.selectors';

@Injectable()
export class IncludesEffects {
  constructor(private actions$: Actions, private store: Store, private cmsService: CMSService) {}

  loadContentInclude$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadContentInclude),
      mapToPayloadProperty('includeId'),
      groupBy(identity),
      mergeMap(group$ =>
        group$.pipe(
          switchMap(includeId =>
            this.cmsService
              .getContentInclude(includeId)
              .pipe(map(loadContentIncludeSuccess), mapErrorToAction(loadContentIncludeFail))
          )
        )
      )
    )
  );

  reloadCmsData$ = createEffect(() => {
    const contentIncludeIds$ = this.store.pipe(select(getAllContentIncludeIds), whenTruthy(), take(1));
    return this.actions$.pipe(
      ofType(setCurrentLocale),
      mapTo(flushCmsData()),
      tap(() => {
        contentIncludeIds$.subscribe(includeIds => {
          includeIds.forEach(includeId => {
            this.store.dispatch(loadContentInclude({ includeId }));
          });
        });
      })
    );
  });
}
