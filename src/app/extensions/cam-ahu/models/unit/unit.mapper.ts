import { Injectable } from '@angular/core';
import * as camelcaseKeys from 'camelcase-keys';

import { UnitData } from './unit.interface';
import { Unit } from './unit.model';

@Injectable({ providedIn: 'root' })
export class UnitMapper {
  static fromData(unitData: UnitData): Unit {
    if (!unitData) {
      throw new Error(`unitData is required`);
    }

    const unit = UnitMapper.parseData(unitData);

    unit.id = String(unit.id || unit?.ahu?.id);

    if (unit?.ahu?.id) {
      unit.ahu.id = String(unit.ahu.id);
    }

    if (unit?.ahu?.ahuManufacturerId) {
      unit.ahu.ahuManufacturerId = String(unit.ahu.ahuManufacturerId);
    }

    if (unit?.ahuAirSlots) {
      unit.ahuAirSlots.map(s => {
        s.ahuSlotId = String(s.ahuSlotId);
        return s;
      });
    }

    return unit;
  }

  static fromListData(unitsData: UnitData[]): Unit[] {
    if (!unitsData) {
      throw new Error('unitsData is required');
    }

    let output = unitsData;

    if (!Array.isArray(output)) {
      output = [output];
    }

    return output.map(data => UnitMapper.fromData(data));
  }

  static parseData(unitData: UnitData) {
    return (camelcaseKeys(unitData, { deep: true }) as unknown) as Unit;
  }
}
