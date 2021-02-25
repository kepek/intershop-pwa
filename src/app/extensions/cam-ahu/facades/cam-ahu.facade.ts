import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { Manufacturer } from '../models/manufacturer/manufacturer.model';
import { Unit } from '../models/unit/unit.model';
import { getCamAhuState } from '../store/cam-ahu-store';
import {
  getAhuManufacturerError,
  getAhuManufacturerLoading,
  getAllAhuManufacturers,
  getSelectedAhuManufacturerDetails,
  loadAhuManufacturers,
  selectAhuManufacturer,
} from '../store/manufacturer';
import { getAhuUnitsError, getAhuUnitsLoading, getAllAhuUnits, getSelectedAhuUnitDetails } from '../store/unit';

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
  ahuManufacturers$(): Observable<Manufacturer[]> {
    this.store.dispatch(loadAhuManufacturers());
    return this.store.pipe(select(getAllAhuManufacturers));
  }

  selectAhuManufacturer$(manufacturerId) {
    this.store.dispatch(selectAhuManufacturer({ manufacturerId }));
  }

  ahuManufacturersLoading$: Observable<boolean> = this.store.pipe(select(getAhuManufacturerLoading));
  ahuManufacturersError$: Observable<HttpError> = this.store.pipe(select(getAhuManufacturerError));
  selectedAhuManufacturer$: Observable<Manufacturer> = this.store.pipe(select(getSelectedAhuManufacturerDetails));

  /**
   * Units
   */
  ahuUnits$: Observable<Unit[]> = this.store.pipe(select(getAllAhuUnits));
  ahuUnitsLoading$: Observable<boolean> = this.store.pipe(select(getAhuUnitsLoading));
  ahuUnitsError$: Observable<HttpError> = this.store.pipe(select(getAhuUnitsError));
  selectedAhuUnit$: Observable<Unit> = this.store.pipe(select(getSelectedAhuUnitDetails));
}
