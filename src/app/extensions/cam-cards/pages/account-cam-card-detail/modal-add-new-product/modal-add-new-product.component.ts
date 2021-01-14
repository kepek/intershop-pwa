import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard, CamCardItemComment } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-modal-add-new-product',
  templateUrl: './modal-add-new-product.component.html',
  styleUrls: ['./modal-add-new-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalAddNewProductComponent implements OnInit, OnDestroy {
  constructor(private productFacade: ShoppingFacade, private camCardsFacade: CamCardsFacade) {}

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  modal: NgbModalRef;
  productForm: FormGroup;

  dummyProduct = { sku: 'dummy', inStock: true, availability: true };
  product$: Observable<ProductView>;
  product: Product;

  currentCamCard$: Observable<CamCard>;
  rootCamCardId: string;

  @Input() addToOrder = false;
  @Input() order?: Bucket;

  showSkuError = false;
  showQuantityError = false;

  private destroy$ = new Subject();

  validators = {
    sku: [
      {
        error: 'required',
        message: 'camfil.modal.addNewProduct.error.required.sku',
      },
    ],
    quantity: [
      {
        error: 'min',
        message: 'camfil.modal.addNewProduct.error.min.quantity',
      },
      {
        error: 'max',
        message: 'camfil.modal.addNewProduct.error.max.quantity',
      },
    ],
  };

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  ngOnInit() {
    this.currentCamCard$ = this.camCardsFacade.currentCamCard$;

    this.currentCamCard$?.pipe(takeUntil(this.destroy$)).subscribe(camCard => {
      if (camCard) {
        this.rootCamCardId = camCard.id;
      }
    });

    this.productForm = new FormGroup({
      quantity: new FormControl(1),
      sku: new FormControl('', [Validators.required]),
      boxLabel: new FormControl('', [Validators.max(10)]),
    });
  }

  isSkuValid = () => !this.product.failed && this.product.availability;

  validateSku() {
    const sku = this.productForm.get('sku').value;

    if (sku) {
      this.product$ = this.productFacade.product$(sku, ModalAddNewProductComponent.REQUIRED_COMPLETENESS_LEVEL);

      this.product$.pipe(takeUntil(this.destroy$)).subscribe(product => {
        this.product = product;
        this.showSkuError = !this.isSkuValid();

        if (this.isSkuValid()) {
          this.setQuantityValidation(this.product.minOrderQuantity, this.product.maxOrderQuantity);
        }
      });
    }
  }

  setQuantityValidation(min: number, max: number) {
    this.productForm.controls.quantity.setValidators([Validators.min(min), Validators.max(max)]);
    this.productForm.controls.quantity.updateValueAndValidity();
  }

  submitForm() {
    if (this.productForm.valid) {
      const sku = this.getField('sku') ? String(this.getField('sku').value) : undefined;
      const quantity = this.getField('quantity') ? Number(this.getField('quantity')?.value) : 1;
      const label = this.getField('boxLabel') ? String(this.getField('boxLabel').value) : undefined;
      const comment: CamCardItemComment = { label };

      if (this.addToOrder) {
        this.productFacade.addProductToBasket(this.product.sku, quantity, this.order.shipToAddress);
      } else {
        this.camCardsFacade.addProductToCamCard(this.rootCamCardId, sku, quantity, comment, 0, true);
      }
      this.hide();
    } else {
      markAsDirtyRecursive(this.productForm);
    }
  }

  resetError() {
    this.showSkuError = false;
    this.product = undefined;
  }

  getField(name: string) {
    return this.productForm.get(name);
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    return this.modalTemplate;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
