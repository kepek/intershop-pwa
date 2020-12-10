import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { Product } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard } from '../../models/cam-card/cam-card.model';

import { CreateOrderModalComponent } from './create-order-modal/create-order-modal.component';

@Component({
  selector: 'camfil-add-to-cart-modal',
  templateUrl: './add-to-cart-modal.component.html',
  styleUrls: ['./add-to-cart-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCartModalComponent implements OnInit, OnDestroy {
  modal: NgbModalRef;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  @Input() product: Product;
  quantityForm: FormGroup;

  selectedOrderId: string;

  basket$: Observable<BasketView>;
  basketId: string;
  buckets$: Observable<any[]>;
  buckets: Bucket[];

  currentCamCard: CamCard;
  camCards: CamCard[];

  showSuccess = false;
  updated = false;
  submitted = false;

  private destroy$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private checkoutFacade: CheckoutFacade,
    private camCardsFacade: CamCardsFacade,
    private shoppingFacade: ShoppingFacade
  ) {}

  ngOnInit() {
    this.initBasket();
    this.updated = false;

    this.quantityForm = new FormGroup({
      quantity: new FormControl(this.product.minOrderQuantity),
      boxLabel: new FormControl('', Validators.maxLength(60)),
    });

    this.shoppingFacade.productAdded$.pipe(takeUntil(this.destroy$)).subscribe((productAdded: boolean) => {
      this.handleSuccess(productAdded);
    });
  }

  initBasket() {
    this.basket$ = this.checkoutFacade.basket$;
    this.buckets$ = this.checkoutFacade.buckets$;

    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.basketId = basket.id;
    });

    this.camCardsFacade.camCard$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(camCards => {
      this.camCards = camCards;
      this.checkoutFacade.loadBuckets();
    });

    this.buckets$.pipe(takeUntil(this.destroy$)).subscribe((buckets: Bucket[]) => {
      if (buckets && this.camCards.length) {
        this.buckets = this.connectWithCamCard(buckets);
      }
    });
  }

  handleSuccess(productAdded: boolean) {
    if (productAdded) {
      if (this.shouldUpdate()) {
        this.updateBoxLabel();
      } else {
        this.showSuccess = true;
      }
    }
  }

  connectWithCamCard(buckets: Bucket[]): Bucket[] {
    return buckets
      .map(bucket => {
        const camCard = this.getCamCard(bucket.deliveryAddressId);

        return camCard && !camCard.transient
          ? {
              ...bucket,
              shipToAddress: camCard.deliveryAddress.urn,
              orderName: camCard.name,
              nextDelivery: camCard.nextDeliveryDate,
              orderMark: camCard.orderLabel,
            }
          : { ...bucket };
      })
      .filter(bucket => bucket.orderName);
  }

  shouldUpdate = () => this.quantityForm.get('boxLabel').value && !this.updated;

  updateBoxLabel() {
    const boxLabel = this.quantityForm.get('boxLabel').value;

    this.updated = true;
    this.shoppingFacade.resetProductAdded();
    this.shoppingFacade.updateBucket(this.basketId, this.currentCamCard.deliveryAddress.id, boxLabel);
  }

  onOrderClicked(orderId: string) {
    this.selectedOrderId = orderId;

    const currentBucket = this.buckets.find(bucket => bucket.id === orderId);
    this.currentCamCard = this.getCamCard(currentBucket.deliveryAddressId);
  }

  getCamCard(deliveryAddressId: string) {
    return this.camCards.find(camcard => camcard.deliveryAddress.id === deliveryAddressId);
  }

  openCreateOrderModal(modal: CreateOrderModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }

  addToOrder() {
    if (this.quantityForm.valid && this.selectedOrderId) {
      const quantity = this.quantityForm.get('quantity').value;
      const shipToAddress = this.buckets.find(bucket => bucket.id === this.selectedOrderId).shipToAddress;

      this.submitted = true;
      this.shoppingFacade.addProductToBasket(this.product.sku, quantity, shipToAddress);
    } else {
      markAsDirtyRecursive(this.quantityForm);
    }
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    this.showSuccess = false;
    return this.modalTemplate;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
