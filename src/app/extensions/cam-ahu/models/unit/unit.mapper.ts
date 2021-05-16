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

    const ahuUnit = UnitMapper.parseData(unitData);

    ahuUnit.id = String(ahuUnit.id || ahuUnit?.ahu?.id);

    if (ahuUnit?.ahu?.id) {
      ahuUnit.ahu.id = String(ahuUnit.ahu.id);
    }

    if (ahuUnit?.ahu?.ahuManufacturerId) {
      ahuUnit.ahu.ahuManufacturerId = String(ahuUnit.ahu.ahuManufacturerId);
    }

    const distinctTypes = [...new Set(ahuUnit.ahuAirSlots.map(airSlot => airSlot.ahuSlotType))].reduce((obj, type) => {
      obj[type] = ahuUnit?.ahuAirSlots?.filter(airSlot => airSlot.ahuSlotType === type)?.length || 0;
      return obj;
    }, {});

    let ahuSlotTypeId = 0;

    if (ahuUnit?.ahuAirSlots) {
      ahuUnit.ahuAirSlots.map((airSlot, index) => {
        if (String(airSlot.ahuSlotId) === '0') {
          airSlot.ahuSlotId = String(index + 1); // TODO (extMlk): Talk to ICC Team and ask why `s.ahuSlotId` is not unique (always = 0);
        }

        const max = distinctTypes[airSlot?.ahuSlotType] || 0;

        ahuSlotTypeId = (ahuSlotTypeId % max) + 1;

        airSlot.ahuSlotTypeId = ahuSlotTypeId;
        airSlot.ahuSlotTypeName = `${airSlot?.ahuSlotType} Slot ${ahuSlotTypeId}`;
        airSlot.ahuSlotDimensions = [airSlot?.ahuSlotWidthMm, airSlot?.ahuSlotLengthMm, airSlot?.ahuSlotDepthMm].join(
          'x'
        );

        return airSlot;
      });
    }

    console.log('ahuUnit', ahuUnit);

    return ahuUnit;
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
