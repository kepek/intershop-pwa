import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionType, Store, select } from '@ngrx/store';
import { identity } from 'rxjs';
import { filter, groupBy, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { getAllViewcontextsBasicInfo, loadViewContextEntrypoint } from 'ish-core/store/content/viewcontexts';
import { setCurrentLocale } from 'ish-core/store/core/configuration';
import { selectPath } from 'ish-core/store/core/router';
import { loginUserSuccess } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

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

  reloadCmsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setCurrentLocale, loginUserSuccess),
      withLatestFrom(this.store.pipe(select(selectPath))),
      filter(([{ payload }, login]) => login === 'login' || payload.hasOwnProperty('lang')),
      withLatestFrom(
        this.store.pipe(select(getAllContentIncludeIds)),
        this.store.pipe(select(getAllViewcontextsBasicInfo))
      ),
      mergeMap(([, includeIds, infos]) => {
        // tslint:disable-next-line: no-any
        const actions = [flushCmsData()] as ActionType<any>[];

        if (includeIds.length) {
          includeIds.forEach(includeId => {
            actions.push(loadContentInclude({ includeId }));
          });
        }

        if (infos.length) {
          infos.forEach(({ viewContextId, callParameters }) => {
            actions.push(loadViewContextEntrypoint({ viewContextId, callParameters }));
          });
        }

        return actions;
      })
    )
  );
}
