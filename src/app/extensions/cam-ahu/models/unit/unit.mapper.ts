import { Injectable } from '@angular/core';
import * as camelcaseKeys from 'camelcase-keys';

import { UnitData } from './unit.interface';
import { Unit } from './unit.model';
import { isEmpty } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class UnitMapper {
  static fromData(unitData: UnitData): Unit {
    if (!unitData) {
      throw new Error(`unitData is required`);
    }

    const ahuUnit = UnitMapper.parseData(unitData);

    if (isEmpty(ahuUnit?.ahu) || isEmpty(ahuUnit?.ahuAirSlots)) {
      return ahuUnit;
    }

    const ahuUnitId = ahuUnit.id || ahuUnit?.ahu?.id;

    if (ahuUnitId) {
      ahuUnit.id = String(ahuUnitId);
    }

    if (ahuUnit?.ahu?.id) {
      ahuUnit.ahu.id = String(ahuUnit.ahu.id);
    }

    if (ahuUnit?.ahu?.ahuManufacturerId) {
      ahuUnit.ahu.ahuManufacturerId = String(ahuUnit.ahu.ahuManufacturerId);
    }

    if (!ahuUnit?.ahu?.ahuShortDescription || ahuUnit?.ahu?.ahuShortDescription?.length === 0) {
      ahuUnit.ahu.ahuShortDescription = [
        { lang: 'EN-US', text: 'A short english description' },
        { lang: 'FI-FI', text: 'Lyhyt kuvaus englanniksi' },
        { lang: 'SV-SE', text: 'En kort svensk beskrivning' },
      ];
    }

    if (!ahuUnit?.ahu?.ahuLongDescription || ahuUnit?.ahu?.ahuLongDescription?.length === 0) {
      ahuUnit.ahu.ahuLongDescription = [
        { lang: 'EN-US', text: 'A long english description' },
        { lang: 'FI-FI', text: 'Pitkä englanninkielinen kuvaus' },
        { lang: 'SV-SE', text: 'En lång svensk beskrivning' },
      ];
    }

    if (!ahuUnit?.ahu?.ahuImages || ahuUnit?.ahu?.ahuImages?.length === 0) {
      ahuUnit.ahu.ahuImages = [
        {
          image: 'https://www.acetec.se/thumb/1111/1024x0/85573be13ec7eeb479afb2277d458c53.jpg?q=50',
          type: 'Image',
        },
      ];
    }

    ahuUnit.ahu.ahuImages = ahuUnit.ahu.ahuImages.map(ahuImage => ({
      ...ahuImage,
      name: 'AHU Image',
      imageActualHeight: 1024,
      imageActualWidth: 683,
      viewID: 'front',
      effectiveUrl: ahuImage.image,
      typeID: 'S',
      primaryImage: true,
    }));

    const distinctTypes = [...new Set(ahuUnit.ahuAirSlots?.map(airSlot => airSlot.ahuSlotType))].reduce((obj, type) => {
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

        airSlot.items.map(item => {
          item.sku = item.item;
          return item;
        });

        return airSlot;
      });
    }

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
