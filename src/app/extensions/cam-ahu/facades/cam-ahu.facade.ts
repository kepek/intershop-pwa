import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { flatten } from 'lodash-es';
import { Observable, combineLatest } from 'rxjs';
import { defaultIfEmpty, filter, first, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.helper';
import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { selectQueryParams } from 'ish-core/store/core/router';
import { getProduct, getProducts } from 'ish-core/store/shopping/products';

import { Manufacturer } from '../models/manufacturer/manufacturer.model';
import { UnitHelper } from '../models/unit/unit.helper';
import {
  Unit,
  UnitAHUAirSlot,
  UnitAHUAirSlotItemParams,
  UnitAHUAirSlotParams,
  UnitAHUAirSlotType,
  UnitAHUBasket,
  UnitAHUBasketItem,
  UnitAhu,
} from '../models/unit/unit.model';
import { getCamAhuState } from '../store/cam-ahu-store';
import {
  getAhuManufacturerError,
  getAhuManufacturerLoading,
  getAllAhuManufacturers,
  getSelectedAhuManufacturer,
  getSelectedAhuManufacturerId,
  isManufacturerInitialized,
  loadAhuManufacturer,
  loadAhuManufacturers,
  selectAhuManufacturer,
} from '../store/manufacturer';
import {
  addAhuSlotItemToList,
  getAhuUnitDetails,
  getAhuUnitsError,
  getAhuUnitsLoading,
  getAllAhuUnits,
  getSelectedAhuUnit,
  getSelectedAhuUnitId,
  loadAhuUnit,
  loadAhuUnits,
  removeAhuSlotItemFromList,
  selectAhuUnit,
} from '../store/unit';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamAhuFacade {
  constructor(private store: Store, private shoppingFacade: ShoppingFacade) {
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
  loadAhuManufacturers() {
    this.store.dispatch(loadAhuManufacturers());
  }

  loadAhuManufacturer$(manufacturerId: string) {
    this.store.dispatch(loadAhuManufacturer({ manufacturerId }));
  }

  selectAhuManufacturer(manufacturerId) {
    this.store.dispatch(selectAhuManufacturer({ manufacturerId }));
  }

  ahuManufacturers$: Observable<Manufacturer[]> = this.store.pipe(select(getAllAhuManufacturers));
  ahuManufacturersLoading$: Observable<boolean> = this.store.pipe(select(getAhuManufacturerLoading));
  ahuManufacturersError$: Observable<HttpError> = this.store.pipe(select(getAhuManufacturerError));
  ahuManufacturersInitialized$: Observable<boolean> = this.store.pipe(select(isManufacturerInitialized));
  selectedAhuManufacturer$: Observable<Manufacturer> = this.store.pipe(select(getSelectedAhuManufacturer));
  selectedAhuManufacturerId$: Observable<PropType<Manufacturer, 'id'>> = this.store.pipe(
    select(getSelectedAhuManufacturerId)
  );

  /**
   * Units
   */
  loadAhuUnits(manufacturerId: string) {
    this.store.dispatch(loadAhuUnits({ manufacturerId }));
  }

  loadAhuUnit(unitId: string) {
    this.store.dispatch(loadAhuUnit({ unitId }));
  }

  selectAhuUnit(unitId: string) {
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
  selectedAhuUnitId$: Observable<PropType<Unit, 'id'>> = this.store.pipe(select(getSelectedAhuUnitId));
  selectedAhuUnitDetails$: Observable<UnitAhu> = this.selectedAhuUnit$.pipe(map(unit => unit?.ahu));
  selectedAhuUnitSlots$: Observable<UnitAHUAirSlot[]> = this.selectedAhuUnit$.pipe(
    map(unit => unit?.ahuAirSlots),
    defaultIfEmpty([])
  );
  selectedAhuUnitBasket$ = this.store.pipe(select(selectQueryParams)).pipe(
    withLatestFrom(this.selectedAhuUnitSlots$),
    map(([queryParams, ahuSlots]) =>
      ahuSlots.map(ahuSlot => {
        // tslint:disable-next-line: ish-no-object-literal-type-assertion
        const newAhuSlot = { ...ahuSlot } as UnitAHUBasket;

        const getSlotItemParams = (item): UnitAHUAirSlotItemParams => ({
          manufacturerId: queryParams?.[UnitHelper.MANUFACTURER_ID_QUERY_PARAM_NAME],
          unitId: queryParams?.[UnitHelper.UNIT_ID_QUERY_PARAM_NAME],
          slotId: newAhuSlot.ahuSlotId,
          sku: item.sku,
        });

        newAhuSlot.items = newAhuSlot?.items.map(item => {
          const newAhuSlotItem = { ...item };
          newAhuSlotItem.quantity = UnitHelper.countAddedItemsBySku(queryParams, getSlotItemParams(item));
          return newAhuSlotItem;
        });

        newAhuSlot.items = newAhuSlot.items?.filter(item =>
          UnitHelper.isAhuUnitSlotItemAdded(queryParams, getSlotItemParams(item))
        );

        const addedItems = flatten(newAhuSlot.items.map(item => new Array(item.quantity).fill(1)));

        newAhuSlot.ahuSlotRemainingAmount = String(Number(newAhuSlot.ahuSlotAmount) - addedItems?.length);

        return newAhuSlot;
      })
    )
  );
  selectedAhuUnitBasketItems$ = this.selectedAhuUnitBasket$.pipe(
    map(
      ahuAirSlotsSummary =>
        [].concat(...ahuAirSlotsSummary.map(ahuAirSlotSummary => ahuAirSlotSummary?.items)) as UnitAHUBasketItem[]
    )
  );
  selectedAhuUnitBasketProducts$ = this.selectedAhuUnitBasketItems$.pipe(
    switchMap(items => {
      const skus = flatten(items.map(item => new Array(item.quantity).fill(item.sku)));

      return this.store.pipe(
        select(getProducts, { skus }),
        map(products => products.filter(product => !product.failed))
      );
    })
  );
  selectedAhuUnitBasketSummary$ = this.selectedAhuUnitBasketProducts$.pipe(
    withLatestFrom(this.store.pipe(select(getCurrentLocale))),
    map(([products, currentLocale]) => ({
      total: UnitHelper.totalPrice(products, { currency: currentLocale?.currency, value: 0 }),
    }))
  );
  selectedAhuUnitAirSlotTypes$: Observable<UnitAHUAirSlotType[]> = this.selectedAhuUnit$.pipe(
    map(ahuUnit => {
      if (!ahuUnit) {
        return [];
      }

      const distinctTypes = [...new Set(ahuUnit.ahuAirSlots.map(airSlot => airSlot.ahuSlotType))];

      return distinctTypes.map(type => {
        const slots = ahuUnit?.ahuAirSlots.filter(airSlot => airSlot.ahuSlotType === type) || [];
        return {
          type,
          name: `${type} Air`,
          count: slots.length,
          dimensions: slots.map(airSlot => airSlot.ahuSlotName),
        };
      });
    })
  );

  // Unit

  isAhuUnitValid$(ahuUnit: Unit) {
    const slots = ahuUnit?.ahuAirSlots.map(ahuSlot => {
      const ahuSlotParams: UnitAHUAirSlotParams = {
        manufacturerId: ahuUnit.ahu.ahuManufacturerId,
        unitId: ahuUnit.id,
        slotId: ahuSlot.ahuSlotId,
      };

      return this.isAhuUnitSlotValid$(ahuSlotParams);
    });

    return combineLatest(slots).pipe(map(s => s.every(valid => valid)));
  }

  // Unit -> Slot

  isAhuUnitSlotValid$(ahuSlotParams: UnitAHUAirSlotParams): Observable<boolean> {
    return this.store.pipe(select(selectQueryParams)).pipe(
      withLatestFrom(this.store.pipe(select(getAhuUnitDetails, { id: ahuSlotParams?.unitId }))),
      map(([queryParams, ahuUnit]) => UnitHelper.isAhuUnitSlotValid(queryParams, ahuSlotParams, ahuUnit))
    );
  }

  // Unit -> Slot -> Item

  addAhuUnitSlotItemToList(ahuSlotItemParams: UnitAHUAirSlotItemParams & { quantity: number }) {
    this.store.dispatch(addAhuSlotItemToList(ahuSlotItemParams));
  }

  removeAhuUnitSlotItemFromList(ahuSlotItemParams: UnitAHUAirSlotItemParams) {
    this.store.dispatch(removeAhuSlotItemFromList(ahuSlotItemParams));
  }

  addSelectedAhuUnitSlotItemProductsToBasket() {
    this.selectedAhuUnitBasketItems$.pipe(take(1)).subscribe(products => {
      if (products.length > 0) {
        products.forEach(product => {
          this.shoppingFacade.addProductToBasket(product.sku, product.quantity);
        });
      }
    });
  }

  addSelectedAhuUnitSlotItemProductsToCamCard() {
    console.log('addSelectedAhuUnitSlotItemProductsToCamCard');
  }

  isAhuUnitSlotItemAdded$(ahuSlotItemParams: UnitAHUAirSlotItemParams): Observable<boolean> {
    return this.store
      .pipe(select(selectQueryParams))
      .pipe(map(queryParams => UnitHelper.isAhuUnitSlotItemAdded(queryParams, ahuSlotItemParams)));
  }

  getAhuUnitSlotItemQuantity$(ahuSlotItemParams: UnitAHUAirSlotItemParams): Observable<number> {
    return this.store
      .pipe(select(selectQueryParams))
      .pipe(map(queryParams => UnitHelper.countAddedItemsBySku(queryParams, ahuSlotItemParams)));
  }

  getAhuUnitSlotMaxQuantity$(ahuSlotParams: UnitAHUAirSlotParams): Observable<number> {
    return this.selectedAhuUnitBasket$.pipe(
      map(baskets => Number(baskets.find(basket => basket.ahuSlotId === ahuSlotParams.slotId).ahuSlotRemainingAmount))
    );
  }

  getAhuUnitSlotItemProduct$(ahuSlotItemParams: UnitAHUAirSlotItemParams, level = ProductCompletenessLevel.Detail) {
    const { manufacturerId, unitId, slotId, sku } = ahuSlotItemParams;

    const ahuSlotParams: UnitAHUAirSlotParams = {
      manufacturerId,
      unitId,
      slotId,
    };

    return this.store.pipe(
      select(getProduct, { sku }),
      filter(p => ProductHelper.isReadyForDisplay(p, level)),
      withLatestFrom(this.getAhuUnitSlotMaxQuantity$(ahuSlotParams)),
      map(([product, maxOrderQuantity]) => {
        if (maxOrderQuantity) {
          product.maxOrderQuantity = maxOrderQuantity;
        }

        return product;
      })
    );
  }

  isAhuUnitSlotItemProductAvailable$(props: { sku: string }): Observable<boolean> {
    const { sku } = props;

    return this.store.pipe(
      select(getProduct, { sku }),
      map(product => (product ? Boolean(!product?.failed) : false))
    );
  }

  /**
   * Common
   */

  ahuLoading$() {
    return combineLatest([this.ahuManufacturersLoading$, this.ahuUnitsLoading$]).pipe(
      map(resources => resources.some(loading => loading))
    );
  }
}
