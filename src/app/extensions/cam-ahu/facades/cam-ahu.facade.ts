import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { defaultIfEmpty, map, switchMap } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { Manufacturer } from '../models/manufacturer/manufacturer.model';
import { Unit } from '../models/unit/unit.model';
import { getCamAhuState } from '../store/cam-ahu-store';
import {
  getAhuManufacturerError,
  getAhuManufacturerLoading,
  getAllAhuManufacturers,
  getSelectedAhuManufacturer,
  loadAhuManufacturers,
  selectAhuManufacturer,
} from '../store/manufacturer';
import {
  getAhuUnitsError,
  getAhuUnitsLoading,
  getAllAhuUnits,
  getSelectedAhuUnit,
  loadAhuUnits,
  selectAhuUnit,
} from '../store/unit';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamAhuFacade {
  constructor(private store: Store) {}

  /**
   * Example for debugging
   */
  camAhuState$ = this.store.pipe(select(getCamAhuState));

  /**
   * Manufacturers
   */
  loadAhuManufacturers$(): Observable<Manufacturer[]> {
    this.store.dispatch(loadAhuManufacturers());
    return this.store.pipe(select(getAllAhuManufacturers));
  }

  selectAhuManufacturer$(manufacturerId) {
    this.store.dispatch(selectAhuManufacturer({ manufacturerId }));
  }

  ahuManufacturers$: Observable<Manufacturer[]> = this.store.pipe(select(getAllAhuManufacturers));
  ahuManufacturersLoading$: Observable<boolean> = this.store.pipe(select(getAhuManufacturerLoading));
  ahuManufacturersError$: Observable<HttpError> = this.store.pipe(select(getAhuManufacturerError));
  selectedAhuManufacturer$: Observable<Manufacturer> = this.store.pipe(select(getSelectedAhuManufacturer));

  /**
   * Units
   */
  loadAhuUnits$(manufacturerId: string) {
    this.store.dispatch(loadAhuUnits({ manufacturerId }));
  }

  selectAhuUnit$(unitId: string) {
    this.store.dispatch(selectAhuUnit({ unitId }));
  }

  ahuUnits$: Observable<Unit[]> = this.store.pipe(select(getAllAhuUnits));
  ahuUnitsLoading$: Observable<boolean> = this.store.pipe(select(getAhuUnitsLoading));
  ahuUnitsError$: Observable<HttpError> = this.store.pipe(select(getAhuUnitsError));
  selectedAhuUnit$: Observable<Unit> = this.store.pipe(select(getSelectedAhuUnit));

  ahuUnitsByManufacturerId$: Observable<Unit[]> = this.selectedAhuManufacturer$.pipe(
    switchMap(manufacturer =>
      this.ahuUnits$.pipe(
        map(units => units.filter(unit => unit?.ahu?.ahuManufacturerId === manufacturer?.id)),
        defaultIfEmpty([])
      )
    )
  );

  // Common

  ahuLoading$() {
    return combineLatest([this.ahuManufacturersLoading$, this.ahuUnitsLoading$]).pipe(
      map(resources => resources.some(loading => loading))
    );
  }
}
