import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivationStart, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Observable, Subject, combineLatest } from 'rxjs';
import { debounce, filter, map, takeUntil } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { CamAhuFacade } from '../../facades/cam-ahu.facade';
import { Manufacturer } from '../../models/manufacturer/manufacturer.model';
import { UnitHelper } from '../../models/unit/unit.helper';
import {
  Unit,
  UnitAHUAirSlot,
  UnitAHUAirSlotItemParams,
  UnitAHUAirSlotParams,
  UnitAHUAirSlotType,
  UnitAHUBasket,
  UnitAHUBasketSummary,
  UnitAhu,
} from '../../models/unit/unit.model';

@Component({ template: '' })
// tslint:disable-next-line: component-creation-test project-structure
export abstract class CamAhuAbstractComponent implements OnInit, OnDestroy {
  ahuManufacturers$: Observable<Manufacturer[]>;
  ahuManufacturersLoading$: Observable<boolean>;
  ahuManufacturersError$: Observable<HttpError>;
  ahuManufacturersInitialized$: Observable<boolean>;
  selectedAhuManufacturer$: Observable<Manufacturer>;
  selectedAhuManufacturerId$: Observable<PropType<Manufacturer, 'id'>>;
  ahuForm: FormGroup;
  ahuUnits$: Observable<Unit[]>;
  ahuUnitsByManufacturerId$: Observable<Unit[]>;
  ahuUnitsLoading$: Observable<boolean>;
  ahuUnitsError$: Observable<HttpError>;
  selectedAhuUnit$: Observable<Unit>;
  selectedAhuUnitId$: Observable<PropType<Unit, 'id'>>;
  selectedAhuUnitDetails$: Observable<UnitAhu>;
  selectedAhuUnitSlots$: Observable<UnitAHUAirSlot[]>;
  selectedAhuUnitBasket$: Observable<UnitAHUBasket[]>;
  selectedAhuUnitBasketSummary$: Observable<UnitAHUBasketSummary>;
  selectedAhuUnitAirSlotTypes$: Observable<UnitAHUAirSlotType[]>;
  ahuLoading$: Observable<boolean>;

  constructor(
    protected router: Router,
    protected fb: FormBuilder,
    protected ahuFacade: CamAhuFacade,
    protected scroller: ViewportScroller
  ) {}

  // tslint:disable-next-line:private-destroy-field
  protected destroy$ = new Subject();

  init() {
    // AHU-Manufacturers
    this.ahuManufacturers$ = this.ahuFacade.ahuManufacturers$;
    this.ahuManufacturersLoading$ = this.ahuFacade.ahuManufacturersLoading$;
    this.ahuManufacturersError$ = this.ahuFacade.ahuManufacturersError$;
    this.ahuManufacturersInitialized$ = this.ahuFacade.ahuManufacturersInitialized$;
    this.selectedAhuManufacturer$ = this.ahuFacade.selectedAhuManufacturer$;
    this.selectedAhuManufacturerId$ = this.ahuFacade.selectedAhuManufacturerId$;
    // AHU-Unit
    this.ahuUnits$ = this.ahuFacade.ahuUnits$;
    this.ahuUnitsByManufacturerId$ = this.ahuFacade.ahuUnitsByManufacturerId$;
    this.ahuUnitsLoading$ = this.ahuFacade.ahuUnitsLoading$;
    this.ahuUnitsError$ = this.ahuFacade.ahuUnitsError$;
    this.selectedAhuUnit$ = this.ahuFacade.selectedAhuUnit$;
    this.selectedAhuUnitId$ = this.ahuFacade.selectedAhuUnitId$;
    this.selectedAhuUnitDetails$ = this.ahuFacade.selectedAhuUnitDetails$;
    this.selectedAhuUnitSlots$ = this.ahuFacade.selectedAhuUnitSlots$;
    this.selectedAhuUnitBasket$ = this.ahuFacade.selectedAhuUnitBasket$;
    this.selectedAhuUnitBasketSummary$ = this.ahuFacade.selectedAhuUnitBasketSummary$;
    this.selectedAhuUnitAirSlotTypes$ = this.ahuFacade.selectedAhuUnitAirSlotTypes$;
    // AHU-Common
    this.ahuLoading$ = this.ahuFacade.ahuLoading$();
    // AHU-Form
    this.ahuForm = this.fb.group({
      manufacturer: new FormControl(undefined, [Validators.required]),
      unit: new FormControl(undefined, [Validators.required]),
    });
    // AHU-Form: Manufacturer-Select-Toggle
    this.ahuManufacturersLoading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.ahuForm.controls.manufacturer[loading ? 'disable' : 'enable']();
    });
    this.ahuUnitsLoading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.ahuForm.controls.unit[loading ? 'disable' : 'enable']();
    });
    // AHU-Form: Manufacturer-Selection-Logic
    this.selectedAhuManufacturer$.pipe(takeUntil(this.destroy$)).subscribe(manufacturer => {
      this.ahuForm.controls.manufacturer.setValue(manufacturer?.id);
      this.ahuForm.controls.unit[manufacturer ? 'enable' : 'disable']();
    });
    // AHU-Form: Unit-Selection-Logic
    this.selectedAhuUnit$.pipe(takeUntil(this.destroy$)).subscribe(unit => {
      this.ahuForm.controls.unit.setValue(unit?.ahu?.id);
    });

    this.router.events
      .pipe(
        // start when navigated
        filter(event => event instanceof NavigationStart),
        // remember current scroll position
        map(() => this.scroller.getScrollPosition()),
        // wait till navigation end
        debounce(() => this.router.events.pipe(filter(event => event instanceof NavigationEnd))),
        // take until routing away
        takeUntil(this.router.events.pipe(filter(event => event instanceof ActivationStart)))
      )
      // tslint:disable-next-line: rxjs-prefer-angular-takeuntil
      .subscribe(position => {
        this.scroller.scrollToPosition(position);
      });

    combineLatest([this.selectedAhuManufacturer$, this.selectedAhuUnit$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([manufacturer, unit]) => {
        const manufacturerId = manufacturer?.id;
        const unitId = unit?.id;
        if (manufacturerId && unitId) {
          this.submitAhuForm(manufacturerId, unitId);
        }
      });
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectAhuManufacturer(event) {
    const manufacturerId = event.value;
    const unitId = undefined;
    const slots = undefined;

    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        [UnitHelper.MANUFACTURER_ID_QUERY_PARAM_NAME]: manufacturerId,
        [UnitHelper.UNIT_ID_QUERY_PARAM_NAME]: unitId,
        [UnitHelper.SLOTS_QUERY_PARAM_NAME]: slots,
      },
    });
  }

  selectAhuUnit(event) {
    const unitId = event.value;
    const slots = undefined;

    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: {
        [UnitHelper.UNIT_ID_QUERY_PARAM_NAME]: unitId,
        [UnitHelper.SLOTS_QUERY_PARAM_NAME]: slots,
      },
    });
  }

  addAhuSlotItemToList(ahuUnit: Unit, slotId: string, sku: string, quantity = 1) {
    const ahuSlotItemParams: UnitAHUAirSlotItemParams = {
      manufacturerId: ahuUnit.ahu.ahuManufacturerId,
      unitId: ahuUnit.id,
      slotId,
      sku,
    };

    this.ahuFacade.addAhuUnitSlotItemToList({ ...ahuSlotItemParams, quantity });
  }

  removeAhuSlotItemFromList(ahuUnit: Unit, slotId: string, sku: string) {
    const ahuSlotItemParams: UnitAHUAirSlotItemParams = {
      manufacturerId: ahuUnit.ahu.ahuManufacturerId,
      unitId: ahuUnit.id,
      slotId,
      sku,
    };

    this.ahuFacade.removeAhuUnitSlotItemFromList(ahuSlotItemParams);
  }

  getAhuUnitSlotItemQuantity$(ahuUnit: Unit, slotId: string, sku: string) {
    const ahuSlotItemParams: UnitAHUAirSlotItemParams = {
      manufacturerId: ahuUnit.ahu.ahuManufacturerId,
      unitId: ahuUnit.id,
      slotId,
      sku,
    };

    return this.ahuFacade.getAhuUnitSlotItemQuantity$(ahuSlotItemParams);
  }

  getAhuUnitSlotItemProduct$(ahuUnit: Unit, slotId: string, sku: string) {
    const ahuSlotItemParams: UnitAHUAirSlotItemParams = {
      manufacturerId: ahuUnit.ahu.ahuManufacturerId,
      unitId: ahuUnit.id,
      slotId,
      sku,
    };

    return this.ahuFacade.getAhuUnitSlotItemProduct$(ahuSlotItemParams);
  }

  isAhuUnitSlotItemAdded$(ahuUnit: Unit, slotId: string, sku: string) {
    const ahuSlotItemParams: UnitAHUAirSlotItemParams = {
      manufacturerId: ahuUnit.ahu.ahuManufacturerId,
      unitId: ahuUnit.id,
      slotId,
      sku,
    };

    return this.ahuFacade.isAhuUnitSlotItemAdded$(ahuSlotItemParams);
  }

  isAhuUnitSlotItemProductAvailable$(props: { sku: string }) {
    return this.ahuFacade.isAhuUnitSlotItemProductAvailable$(props);
  }

  isAhuUnitSlotValid$(ahuUnit: Unit, slotId: string) {
    const ahuSlotParams: UnitAHUAirSlotParams = {
      manufacturerId: ahuUnit.ahu.ahuManufacturerId,
      unitId: ahuUnit.id,
      slotId,
    };

    return this.ahuFacade.isAhuUnitSlotValid$(ahuSlotParams);
  }

  isAhuUnitValid$(ahuUnit: Unit) {
    return this.ahuFacade.isAhuUnitValid$(ahuUnit);
  }

  scrollToAnchor(anchor: string) {
    this.scroller.scrollToAnchor(anchor);
  }

  // tslint:disable-next-line:force-jsdoc-comments
  // @ts-ignore
  // tslint:disable-next-line:no-unused
  submitAhuForm(manufacturerId: string, unitId: string) {}
}
