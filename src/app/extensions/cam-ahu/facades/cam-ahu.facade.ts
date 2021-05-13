import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { defaultIfEmpty, first, map, switchMap } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { Manufacturer } from '../models/manufacturer/manufacturer.model';
import { Unit, UnitAHUAirSlotType } from '../models/unit/unit.model';
import { getCamAhuState } from '../store/cam-ahu-store';
import {
  getAhuManufacturerError,
  getAhuManufacturerLoading,
  getAllAhuManufacturers,
  getSelectedAhuManufacturer,
  isManufacturerInitialized,
  loadAhuManufacturer,
  loadAhuManufacturers,
  selectAhuManufacturer,
} from '../store/manufacturer';
import {
  addToList,
  getAhuUnitsError,
  getAhuUnitsLoading,
  getAllAhuUnits,
  getSelectedAhuUnit,
  loadAhuUnit,
  loadAhuUnits,
  removeFromList,
  selectAhuUnit,
} from '../store/unit';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamAhuFacade {
  constructor(private store: Store) {
    setTimeout(() => {
      store.pipe(first()).subscribe(state => {
        if (!isManufacturerInitialized(state)) {
          store.dispatch(loadAhuManufacturers());
        }
      });
    });
  }

  /**
   * Example for debugging
   */
  camAhuState$ = this.store.pipe(select(getCamAhuState));

  /**
   * Manufacturers
   */
  loadAhuManufacturers$() {
    this.store.dispatch(loadAhuManufacturers());
  }

  loadAhuManufacturer$(manufacturerId: string) {
    this.store.dispatch(loadAhuManufacturer({ manufacturerId }));
  }

  selectAhuManufacturer$(manufacturerId) {
    this.store.dispatch(selectAhuManufacturer({ manufacturerId }));
  }

  ahuManufacturers$: Observable<Manufacturer[]> = this.store.pipe(select(getAllAhuManufacturers));
  ahuManufacturersLoading$: Observable<boolean> = this.store.pipe(select(getAhuManufacturerLoading));
  ahuManufacturersError$: Observable<HttpError> = this.store.pipe(select(getAhuManufacturerError));
  ahuManufacturersInitialized$: Observable<boolean> = this.store.pipe(select(isManufacturerInitialized));
  selectedAhuManufacturer$: Observable<Manufacturer> = this.store.pipe(select(getSelectedAhuManufacturer));

  /**
   * Units
   */
  loadAhuUnits$(manufacturerId: string) {
    this.store.dispatch(loadAhuUnits({ manufacturerId }));
  }

  loadAhuUnit$(unitId: string) {
    this.store.dispatch(loadAhuUnit({ unitId }));
  }

  selectAhuUnit$(unitId: string) {
    this.store.dispatch(selectAhuUnit({ unitId }));
  }

  ahuUnits$: Observable<Unit[]> = this.store.pipe(select(getAllAhuUnits));
  ahuUnitsLoading$: Observable<boolean> = this.store.pipe(select(getAhuUnitsLoading));
  ahuUnitsError$: Observable<HttpError> = this.store.pipe(select(getAhuUnitsError));
  ahuUnitsByManufacturerId$: Observable<Unit[]> = this.selectedAhuManufacturer$.pipe(
    switchMap(manufacturer =>
      this.ahuUnits$.pipe(
        map(units => units.filter(unit => unit?.ahu?.ahuManufacturerId === manufacturer?.id)),
        defaultIfEmpty([])
      )
    )
  );
  selectedAhuUnit$: Observable<Unit> = this.store.pipe(select(getSelectedAhuUnit));
  selectedAhuUnitAirSlotTypes$: Observable<UnitAHUAirSlotType[]> = this.store.pipe(
    select(getSelectedAhuUnit),
    map(ahuUnit => {
      if (!ahuUnit) {
        return [];
      }

      const distinctTypes = [...new Set(ahuUnit.ahuAirSlots.map(airSlot => airSlot.ahuSlotType))];

      return distinctTypes.map(type => {
        const filterSlots = ahuUnit?.ahuAirSlots.filter(airSlot => airSlot.ahuSlotType === type) || [];
        return {
          type,
          name: `${type} Air`,
          count: filterSlots.length,
          dimensions: filterSlots.map(airSlot => airSlot.ahuSlotName),
        };
      });
    })
  );

  // Common

  ahuLoading$() {
    return combineLatest([this.ahuManufacturersLoading$, this.ahuUnitsLoading$]).pipe(
      map(resources => resources.some(loading => loading))
    );
  }

  // List

  addToList$(manufacturerId: string, unitId: string, slotId: string, sku: string) {
    this.store.dispatch(addToList({ manufacturerId, unitId, slotId, sku }));
  }

  removeFromList$(manufacturerId: string, unitId: string, slotId: string, sku: string) {
    this.store.dispatch(removeFromList({ manufacturerId, unitId, slotId, sku }));
  }
}
