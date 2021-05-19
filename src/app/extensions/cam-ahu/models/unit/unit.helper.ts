import { Params } from '@angular/router';
import * as qs from 'qs';

import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Price, PriceHelper } from 'ish-core/models/price/price.model';

import {
  Unit,
  UnitAHUAirSlotItemParams,
  UnitAHUAirSlotItemQueryParam,
  UnitAHUAirSlotParams,
  UnitAhuAirSlotProductView,
} from './unit.model';

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

    const prevSlots: UnitAHUAirSlotItemQueryParam = UnitHelper.parseQs(
      queryParams?.[UnitHelper.SLOTS_QUERY_PARAM_NAME]
    );
    const nextSlots: UnitAHUAirSlotItemQueryParam = {};

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

    const prevSlots: UnitAHUAirSlotItemQueryParam = UnitHelper.parseQs(
      queryParams?.[UnitHelper.SLOTS_QUERY_PARAM_NAME]
    );
    const nextSlots: UnitAHUAirSlotItemQueryParam = {};

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

  static countAddedItemsBySku(queryParams: Params, ahuSlotItemParams: UnitAHUAirSlotItemParams) {
    const { slotId, sku } = ahuSlotItemParams;
    const slots: UnitAHUAirSlotItemQueryParam = UnitHelper.parseQs(queryParams?.[UnitHelper.SLOTS_QUERY_PARAM_NAME]);

    return [].concat(slots?.[slotId]).filter(item => item === sku)?.length;
  }

  static isAhuUnitSlotItemAdded(queryParams: Params, ahuSlotItemParams: UnitAHUAirSlotItemParams) {
    const { manufacturerId, unitId } = ahuSlotItemParams;

    const isAdded = Boolean(UnitHelper.countAddedItemsBySku(queryParams, ahuSlotItemParams));
    const isMatchingManufacturerId = queryParams?.[UnitHelper.MANUFACTURER_ID_QUERY_PARAM_NAME] === manufacturerId;
    const isMatchingUnitId = queryParams?.[UnitHelper.UNIT_ID_QUERY_PARAM_NAME] === unitId;

    return isAdded && isMatchingManufacturerId && isMatchingUnitId;
  }

  static isAhuUnitSlotValid(queryParams: Params, ahuSlotParams: UnitAHUAirSlotParams, ahuUnit: Unit) {
    const { manufacturerId, unitId, slotId } = ahuSlotParams;
    const slots: UnitAHUAirSlotItemQueryParam = UnitHelper.parseQs(queryParams?.[UnitHelper.SLOTS_QUERY_PARAM_NAME]);
    const currentSlotAmount = slots?.[slotId]?.length || 0;
    const requiredSlotAmount = Number(ahuUnit.ahuAirSlots?.find(slot => slot.ahuSlotId === slotId)?.ahuSlotAmount || 0);

    const isValid = currentSlotAmount === requiredSlotAmount;
    const isMatchingManufacturerId = queryParams?.[UnitHelper.MANUFACTURER_ID_QUERY_PARAM_NAME] === manufacturerId;
    const isMatchingUnitId = queryParams?.[UnitHelper.UNIT_ID_QUERY_PARAM_NAME] === unitId;

    return isValid && isMatchingManufacturerId && isMatchingUnitId;
  }

  static totalPrice(
    items: UnitAhuAirSlotProductView[],
    defaults: { currency: string; value: number } = { currency: 'USD', value: 0 }
  ): Price {
    const getCurrency = element => element.listPrice?.currency || defaults?.currency;
    const getValue = element => element.listPrice?.value || defaults?.value;

    return PriceHelper.getPrice(getCurrency, getValue, (items as unknown) as LineItemView[]);
  }
}
