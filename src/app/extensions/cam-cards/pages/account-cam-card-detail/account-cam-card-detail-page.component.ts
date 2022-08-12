import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CamfilShoppingFacade } from 'camfil-pwa/facades/camfil-shopping.facade';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCardHelper } from '../../models/cam-card/cam-card.helper';
import { CamCard, CamCardItem } from '../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-detail-page',
  templateUrl: './account-cam-card-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./account-cam-card-detail-page.component.scss'],
})
export class AccountCamCardDetailPageComponent implements OnInit, OnDestroy {
  camCard$: Observable<CamCard>;
  camCardError$: Observable<HttpError>;
  camCardLoading$: Observable<boolean>;
  productsLoading$: Observable<boolean>;
  deviceType$: Observable<DeviceType>;

  selectedItemsForm: FormArray;
  selectedItems: CamCardItem[];
  maintenance = CamCardHelper.maintenance;
  sortParam = {
    activeSort: '',
    sortDirection: '',
  };

  private destroy$ = new Subject();

  constructor(
    private camCardsFacade: CamCardsFacade,
    public router: Router,
    private appFacade: AppFacade,
    private activatedRoute: ActivatedRoute,
    private shoppingFacade: CamfilShoppingFacade
  ) {}

  ngOnInit() {
    this.camCard$ = this.camCardsFacade.currentCamCard$;
    this.camCardError$ = this.camCardsFacade.camCardError$;
    this.camCardLoading$ = this.camCardsFacade.camCardLoading$;
    this.productsLoading$ = this.shoppingFacade.productsLoading$;
    this.deviceType$ = this.appFacade.deviceType$;
    this.initForm();

    this.selectedItemsForm.valueChanges
      .pipe(withLatestFrom(this.camCard$), takeUntil(this.destroy$))
      .subscribe(([, camCards]) => {
        this.selectedItems = this.filterItems(camCards);
      });

    this.activatedRoute.queryParams.pipe(take(1)).subscribe(queryParam => {
      if (queryParam.activeSort && queryParam.sortDirection) {
        this.sortParam = {
          activeSort: queryParam.activeSort,
          sortDirection: queryParam.sortDirection,
        };
      }
    });
  }

  private initForm() {
    this.createSelectedItemsForm();

    // On item moved or deleted clear form array
    this.camCard$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.selectedItemsForm.controls.length > 0) {
        this.createSelectedItemsForm();
      }
    });
  }

  createSelectedItemsForm() {
    this.selectedItemsForm = new FormArray([]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editPreferences(camCard: CamCard, camCardName: string) {
    this.camCardsFacade.updateCamCard({
      ...camCard,
      id: camCardName,
    });
  }

  filterItems(camCards): CamCardItem[] {
    return camCards.camCardItems.filter(item =>
      this.selectedItemsForm.value.find(p => p.sku === item.product.sku && p.productCheckbox === true)
    );
  }

  /** dispatch creation request */
  addCamCard(camCard: CamCard) {
    this.camCardsFacade.addCamCard(camCard);
  }

  /** dispatch edit request */
  updateCamCard(camCard: CamCard) {
    this.camCardsFacade.updateCamCard(camCard);
  }

  get sortQueryParam() {
    return this.sortParam;
  }
}
