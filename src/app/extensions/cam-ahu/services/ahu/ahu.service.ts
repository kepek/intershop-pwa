import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService as IccApiService } from '../../../cam-icc/services/api/api.service';
import { ManufacturerData } from '../../models/manufacturer/manufacturer.interface';
import { ManufacturerMapper } from '../../models/manufacturer/manufacturer.mapper';
import { Manufacturer } from '../../models/manufacturer/manufacturer.model';
import { UnitData } from '../../models/unit/unit.interface';
import { UnitMapper } from '../../models/unit/unit.mapper';
import { Unit } from '../../models/unit/unit.model';

@Injectable({ providedIn: 'root' })
export class AhuService {
  constructor(private iccApiService: IccApiService) {}

  /**
   * List manufacturers for different markets.
   *
   * @param market              Specify market or get all results matching the query
   */
  getManufacturers(market?: string): Observable<Manufacturer[]> {
    const params = new HttpParams().set('market', market);

    return this.iccApiService
      .get<ManufacturerData[]>('ahu/manufacturer', {
        params,
      })
      .pipe(map(data => ManufacturerMapper.fromListData(data)));
  }

  getManufacturer(manufacturerId: string, market?: string): Observable<Manufacturer> {
    const params = new HttpParams().set('id', manufacturerId).set('market', market);

    return this.iccApiService
      .get<ManufacturerData>('ahu/manufacturer', {
        params,
      })
      .pipe(
        map(data => {
          if (Array.isArray(data)) {
            return ManufacturerMapper.fromListData(data).find(m => m.id === manufacturerId);
          }

          return ManufacturerMapper.fromData(data);
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

    const params = new HttpParams().set('ManufacturerId', manufacturerId).set('Market', market);

    return this.iccApiService
      .get<UnitData[]>('ahu/unit', {
        params,
      })
      .pipe(map(data => UnitMapper.fromListData(data)));
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

    const params = new HttpParams().set('UnitId', unitId).set('Market', market).set('SlotId', slotId);

    return this.iccApiService
      .get<UnitData>('ahu/unit', {
        params,
      })
      .pipe(
        map(data => {
          if (Array.isArray(data)) {
            return UnitMapper.fromListData(data).find(u => u?.ahu?.id === unitId);
          }

          return UnitMapper.fromData(data);
        })
      );
  }
}
