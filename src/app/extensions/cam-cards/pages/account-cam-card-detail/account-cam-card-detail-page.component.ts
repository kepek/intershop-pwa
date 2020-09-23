import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard, CamCardItem } from '../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-detail-page',
  templateUrl: './account-cam-card-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardDetailPageComponent implements OnInit, OnDestroy {
  camCard$: Observable<CamCard>;
  camCardError$: Observable<HttpError>;
  camCardLoading$: Observable<boolean>;

  selectedItemsForm: FormArray;
  selectedItems: CamCardItem[];
  dummyProduct = { sku: 'dummy', inStock: true, availability: true };

  private destroy$ = new Subject();

  constructor(private camCardsFacade: CamCardsFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.camCard$ = this.camCardsFacade.currentCamCard$;
    this.camCardLoading$ = this.camCardsFacade.camCardLoading$;
    this.camCardError$ = this.camCardsFacade.camCardError$;
    this.initForm();

    this.selectedItemsForm.valueChanges
      .pipe(withLatestFrom(this.camCard$), takeUntil(this.destroy$))
      .subscribe(([, camCards]) => {
        this.selectedItems = this.filterItems(camCards);
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
    return camCards.items.filter(item =>
      this.selectedItemsForm.value.find(p => p.sku === item.sku && p.productCheckbox === true)
    );
  }

  addSelectedItemsToCart(camCard: CamCard) {
    this.filterItems(camCard).forEach(item => {
      this.shoppingFacade.addProductToBasket(item.sku, item.desiredQuantity.value);
    });
  }
}
