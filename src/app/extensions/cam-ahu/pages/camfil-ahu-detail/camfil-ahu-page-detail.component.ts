import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Product } from 'ish-core/models/product/product.model';

import { CamAhuFacade } from '../../facades/cam-ahu.facade';
import { Unit, UnitAHUAirSlot } from '../../models/unit/unit.model';

import { PRODUCT } from './database';

@Component({
  selector: 'camfil-ahu-page-detail',
  styleUrls: ['./camfil-ahu-page-detail.component.scss'],
  templateUrl: './camfil-ahu-page-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAHUPageDetailComponent implements OnInit, OnDestroy {
  product: Product = PRODUCT;
  unitAHUAirSlots: UnitAHUAirSlot[];
  isMoreDetailsOpen = false;
  selectedAhuUnit$: Observable<Unit>;
  selectedAhuUnit: Unit;
  constructor(private ahuFacade: CamAhuFacade) {}

  private destroy$ = new Subject<void>();
  ngOnInit() {
    this.ahuFacade.selectedAhuUnit$?.pipe(takeUntil(this.destroy$)).subscribe(unit => {
      this.unitAHUAirSlots = unit?.ahuAirSlots;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDetails() {
    this.isMoreDetailsOpen = !this.isMoreDetailsOpen;
  }
}
