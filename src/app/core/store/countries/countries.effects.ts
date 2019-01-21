import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';

import { mapErrorToAction } from 'ish-core/utils/operators';
import { CountryService } from '../../services/country/country.service';

import * as countryActions from './countries.actions';
import { getAllCountries } from './countries.selectors';

@Injectable()
export class CountriesEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private countryService: CountryService) {}

  @Effect()
  loadCountries$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    withLatestFrom(this.store.pipe(select(getAllCountries))),
    filter(([, countries]) => !countries.length),
    concatMap(() =>
      this.countryService.getCountries().pipe(
        map(countries => new countryActions.LoadCountriesSuccess({ countries })),
        mapErrorToAction(countryActions.LoadCountriesFail)
      )
    )
  );
}
