import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, debounceTime, filter, map, mergeMap, reduce, window, withLatestFrom } from 'rxjs/operators';

import { CountryService } from 'ish-core/services/country/country.service';
import { mapErrorToAction } from 'ish-core/utils/operators';

import { loadCountries, loadCountriesFail, loadCountriesSuccess } from './countries.actions';
import { getAllCountries } from './countries.selectors';

@Injectable()
export class CountriesEffects {
  constructor(private actions$: Actions, private store: Store, private countryService: CountryService) {}

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCountries),
      window(this.actions$.pipe(ofType(loadCountries), debounceTime(1000))),
      mergeMap(window$ =>
        window$.pipe(
          withLatestFrom(this.store.pipe(select(getAllCountries))),
          filter(([, countries]) => !countries.length),
          reduce(acc => acc + 1, 0),
          filter(list => list > 0),
          concatMap(() =>
            this.countryService.getCountries().pipe(
              map(countries => loadCountriesSuccess({ countries })),
              mapErrorToAction(loadCountriesFail)
            )
          )
        )
      )
    )
  );
}
