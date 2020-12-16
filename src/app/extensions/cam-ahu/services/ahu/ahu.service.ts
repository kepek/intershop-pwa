import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService as IccApiService } from '../../../cam-icc/services/api/api.service';
import { ManufacturerData } from '../../models/manufacturer/manufacturer.interface';
import { ManufacturerMapper } from '../../models/manufacturer/manufacturer.mapper';
import { Manufacturer } from '../../models/manufacturer/manufacturer.model';
import { UnitData } from '../../models/unit/unit.interface';
import { UnitMapper } from '../../models/unit/unit.mapper';
import { Unit } from '../../models/unit/unit.model';
import { manufacturers } from '../../store/manufacturer/manufacturer.mock';
import { units } from '../../store/unit/unit.mock';

export function unpackHeap<T>(): OperatorFunction<[], T[]> {
  return map(data => (!!data && !!data.length ? data : []));
}

@Injectable({ providedIn: 'root' })
export class AhuService {
  constructor(private iccApiService: IccApiService) {}

  /**
   * List manufacturers for different markets.
   *
   * @param market              Specify market or get all results matching the query
   */
  getManufacturers(market?: string): Observable<Manufacturer[]> {
    const requestBody = { market };

    return this.iccApiService.post<ManufacturerData[]>('ahu/manufacturer', requestBody).pipe(
      unpackHeap<ManufacturerData>(),
      map(data => {
        if (data && data.length) {
          return ManufacturerMapper.fromListData(data);
        }

        // TODO (extMlk): Remove when ICC/AHU Team will fix the API.
        console.warn('[AHU] Mocking response in AhuService.getManufacturers().');

        return manufacturers;
      })
    );
  }

  getManufacturer(id: string, market?: string): Observable<Manufacturer> {
    const requestBody = { id, market };

    return this.iccApiService.post<ManufacturerData>('ahu/manufacturer', requestBody).pipe(
      map(data => {
        if (Array.isArray(data)) {
          return ManufacturerMapper.fromListData(data).find(m => m.id === id);
        }

        if (data) {
          return ManufacturerMapper.fromData(data);
        }

        // TODO (extMlk): Remove when ICC/AHU Team will fix the API.
        console.warn('[AHU] Mocking response in AhuService.getManufacturer().');

        return manufacturers[0];
      })
    );
  }

  /**
   * Get air handling units.
   * @param manufacturerId
   * @param market
   */
  getUnits(manufacturerId: string, market?: string): Observable<Unit[]> {
    if (!manufacturerId) {
      return throwError('getUnits() called without manufacturerId');
    }

    const requestBody = {
      ManufacturerId: manufacturerId,
      Market: market,
    };

    return this.iccApiService.post<UnitData[]>('ahu/unit', requestBody).pipe(
      unpackHeap<UnitData>(),
      map(data => {
        if (data && data.length) {
          return UnitMapper.fromListData(data);
        }

        // TODO (extMlk): Remove when ICC/AHU Team will fix the API.
        console.warn('[AHU] Mocking response in AhuService.getUnits().');

        return units;
      })
    );
  }

  /**
   * Get air handling units. If no unitId is provided, the AHUAirSlots will be supressed from the output.
   *
   * @param unitId              Id of the Air Handling Unit
   * @param market              Market the AHU is released for
   * @param slotId              Id of the slot in the AHU
   */
  getUnit(unitId: string, market?: string, slotId?: string): Observable<Unit> {
    if (!unitId) {
      return throwError('getUnits() called without unitId');
    }

    const requestBody = {
      UnitId: unitId,
      Market: market,
      SlotId: slotId,
    };

    return this.iccApiService.post<UnitData>('ahu/unit', requestBody).pipe(
      map(data => {
        if (Array.isArray(data)) {
          return UnitMapper.fromListData(data).find(u => u?.ahu?.id === unitId);
        }

        if (data) {
          return UnitMapper.fromData(data);
        }

        // TODO (extMlk): Remove when ICC/AHU Team will fix the API.
        console.warn('[AHU] Mocking response in AhuService.getUnit().');

        return units[0];
      })
    );
  }
}
