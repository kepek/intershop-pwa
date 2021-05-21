import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';

import { ApiService as IccApiService } from '../../../cam-icc/services/api/api.service';
import { ManufacturerData } from '../../models/manufacturer/manufacturer.interface';
import { ManufacturerMapper } from '../../models/manufacturer/manufacturer.mapper';
import { Manufacturer } from '../../models/manufacturer/manufacturer.model';
import { UnitData } from '../../models/unit/unit.interface';
import { UnitMapper } from '../../models/unit/unit.mapper';
import { Unit } from '../../models/unit/unit.model';

export function unpackHeap<T>(): OperatorFunction<[], T[]> {
  return map(data => (!!data && !!data.length ? data : []));
}

@Injectable({ providedIn: 'root' })
export class AhuService {
  constructor(private iccApiService: IccApiService, private appFacade: AppFacade) {}

  market$ = this.appFacade.getCountryByChannel$.pipe(take(1));

  /**
   * List manufacturers for a current channel/market.
   */
  getManufacturers(): Observable<Manufacturer[]> {
    return this.appFacade.getCountryByChannel$.pipe(
      take(1),
      switchMap(countryCode => {
        const requestBody = { market: countryCode };

        return this.iccApiService.post<ManufacturerData[]>('ahu/manufacturer', requestBody).pipe(
          unpackHeap<ManufacturerData>(),
          map(data => {
            if (data && data.length) {
              return ManufacturerMapper.fromListData(data);
            }
          })
        );
      })
    );
  }

  /**
   * Get Manufacturer by ID for a current channel/market.
   * @param id
   */
  getManufacturer(id: string): Observable<Manufacturer> {
    return this.appFacade.getCountryByChannel$.pipe(
      take(1),
      switchMap(countryCode => {
        const requestBody = { id, market: countryCode };

        return this.iccApiService.post<ManufacturerData>('ahu/manufacturer', requestBody).pipe(
          map(data => {
            if (Array.isArray(data)) {
              return ManufacturerMapper.fromListData(data).find(m => m.id === id);
            }

            if (data) {
              return ManufacturerMapper.fromData(data);
            }
          })
        );
      })
    );
  }

  /**
   * Get air handling units.
   * @param manufacturerId
   */
  getUnits(manufacturerId: string): Observable<Unit[]> {
    if (!manufacturerId) {
      return throwError('getUnits() called without manufacturerId');
    }

    return this.appFacade.getCountryByChannel$.pipe(
      take(1),
      switchMap(countryCode => {
        const requestBody = {
          ManufacturerId: manufacturerId,
          Market: countryCode,
        };

        return this.iccApiService.post<UnitData[]>('ahu/unit', requestBody).pipe(
          unpackHeap<UnitData>(),
          map(data => {
            if (data && data.length) {
              return UnitMapper.fromListData(data);
            }
          })
        );
      })
    );
  }

  /**
   * Get air handling units. If no unitId is provided, the AHUAirSlots will be supressed from the output.
   *
   * @param unitId              Id of the Air Handling Unit
   * @param slotId              Id of the slot in the AHU
   */
  getUnit(unitId: string, slotId?: string): Observable<Unit> {
    if (!unitId) {
      return throwError('getUnits() called without unitId');
    }

    return this.appFacade.getCountryByChannel$.pipe(
      take(1),
      switchMap(countryCode => {
        const requestBody = {
          UnitId: unitId,
          SlotId: slotId,
          Market: countryCode,
        };

        return this.iccApiService.post<UnitData>('ahu/unit', requestBody).pipe(
          map(data => {
            if (Array.isArray(data)) {
              return UnitMapper.fromListData(data).find(u => u?.ahu?.id === unitId);
            }

            if (data) {
              return UnitMapper.fromData(data);
            }
          })
        );
      })
    );
  }
}
