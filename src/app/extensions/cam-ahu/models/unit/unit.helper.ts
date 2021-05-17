import { Params } from '@angular/router';
import * as qs from 'qs';

import { Unit, UnitAHUAirSlotItemParams, UnitAHUAirSlotParams } from './unit.model';

export class UnitHelper {
  static MANUFACTURER_ID_QUERY_PARAM_NAME = 'manufacturerId';
  static UNIT_ID_QUERY_PARAM_NAME = 'unitId';
  static SLOTS_QUERY_PARAM_NAME = 'slots';

  static equal(unit1: Unit, unit2: Unit): boolean {
    return !!unit1 && !!unit2 && unit1?.ahu?.id === unit2.ahu?.id;
  }

  static stringifyToQs(obj: {}) {
    return qs.stringify(obj, { encode: false });
  }

  static parseQs(str: string) {
    return { ...JSON.parse(JSON.stringify(qs.parse(str))) };
  }

  static addAhuSlotItemToList(queryParams: Params, ahuSlotItemParams: UnitAHUAirSlotItemParams) {
    const { manufacturerId, unitId, slotId, sku } = ahuSlotItemParams;

    const prevSlots = UnitHelper.parseQs(queryParams?.[UnitHelper.SLOTS_QUERY_PARAM_NAME]);
    const nextSlots = {};

    nextSlots[slotId] = prevSlots[slotId] ? [...prevSlots[slotId], sku] : [sku];

    const newSlots = { ...prevSlots, ...nextSlots };

    const slots = Object.keys(newSlots)?.length ? UnitHelper.stringifyToQs(newSlots) : undefined;

    return {
      [UnitHelper.MANUFACTURER_ID_QUERY_PARAM_NAME]: manufacturerId,
      [UnitHelper.UNIT_ID_QUERY_PARAM_NAME]: unitId,
      [UnitHelper.SLOTS_QUERY_PARAM_NAME]: slots,
    };
  }

  static removeAhuSlotItemFromList(queryParams: Params, ahuSlotItemParams: UnitAHUAirSlotItemParams) {
    const { manufacturerId, unitId, slotId, sku } = ahuSlotItemParams;

    const prevSlots = UnitHelper.parseQs(queryParams?.[UnitHelper.SLOTS_QUERY_PARAM_NAME]);
    const nextSlots = {};

    nextSlots[slotId] = prevSlots[slotId] ? [...prevSlots[slotId]].filter(item => item !== sku) : [];

    const newSlots = { ...prevSlots, ...nextSlots };

    if (newSlots[slotId].length === 0) {
      delete newSlots[slotId];
    }

    const slots = Object.keys(newSlots)?.length ? UnitHelper.stringifyToQs(newSlots) : undefined;

    return {
      [UnitHelper.MANUFACTURER_ID_QUERY_PARAM_NAME]: manufacturerId,
      [UnitHelper.UNIT_ID_QUERY_PARAM_NAME]: unitId,
      [UnitHelper.SLOTS_QUERY_PARAM_NAME]: slots,
    };
  }

  static isAhuUnitSlotItemAdded(queryParams: Params, ahuSlotItemParams: UnitAHUAirSlotItemParams) {
    const { manufacturerId, unitId, slotId, sku } = ahuSlotItemParams;
    const slots = UnitHelper.parseQs(queryParams?.[UnitHelper.SLOTS_QUERY_PARAM_NAME]);

    const isAdded = [].concat(slots?.[slotId]).includes(sku);
    const isMatchingManufacturerId = queryParams?.[UnitHelper.MANUFACTURER_ID_QUERY_PARAM_NAME] === manufacturerId;
    const isMatchingUnitId = queryParams?.[UnitHelper.UNIT_ID_QUERY_PARAM_NAME] === unitId;

    return isAdded && isMatchingManufacturerId && isMatchingUnitId;
  }

  static isAhuUnitSlotValid(queryParams: Params, ahuSlotParams: UnitAHUAirSlotParams, ahuUnit: Unit) {
    const { manufacturerId, unitId, slotId } = ahuSlotParams;
    const slots = UnitHelper.parseQs(queryParams?.[UnitHelper.SLOTS_QUERY_PARAM_NAME]);
    const currentSlotAmount = slots?.[slotId]?.length || 0;
    const requiredSlotAmount = Number(ahuUnit.ahuAirSlots?.find(slot => slot.ahuSlotId === slotId)?.ahuSlotAmount || 0);

    const isValid = currentSlotAmount === requiredSlotAmount;
    const isMatchingManufacturerId = queryParams?.[UnitHelper.MANUFACTURER_ID_QUERY_PARAM_NAME] === manufacturerId;
    const isMatchingUnitId = queryParams?.[UnitHelper.UNIT_ID_QUERY_PARAM_NAME] === unitId;

    return isValid && isMatchingManufacturerId && isMatchingUnitId;
  }
}
