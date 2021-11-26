import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { isEmpty } from 'lodash-es';
import { Observable, ReplaySubject, Subject, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.helper';
import { ProductView, createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product, ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard, CamCardItemComment } from '../../../models/cam-card/cam-card.model';

import { ADD_NEW_PRODUCT_VALIDATORS } from './validators';

const FAKE_SKU = '144c9defac04969c7bfad8efaa8ea194';

const createFakeProduct = (product?: Product) =>
  createProductView(
    // tslint:disable-next-line:ish-no-object-literal-type-assertion
    {
      minOrderQuantity: 0,
      maxOrderQuantity: 0,
      sku: FAKE_SKU,
      inStock: true,
      availability: true,
      attributes: [],
      failed: true,
      ...product,
    } as Product,
    CategoryTreeHelper.empty()
  );

@Component({
  selector: 'camfil-modal-add-new-product',
  templateUrl: './modal-add-new-product.component.html',
  styleUrls: ['./modal-add-new-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalAddNewProductComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private shoppingFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade,
    public dialog: MatDialog
  ) {}

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;

  private rootCamCardId: string;
  private destroy$ = new Subject();

  sku$ = new ReplaySubject<string>(1);
  productIsLoading$: Observable<boolean>;
  product$: Observable<ProductView>;
  productHasValidSku$: Observable<boolean>;
  productRequiresMeasurement$: Observable<boolean>;
  productFormIsDisabled$: Observable<boolean>;
  currentCamCard$: Observable<CamCard>;

  @Input() addToOrder = false;
  @Input() order?: Bucket;
  @Input() shippingMethodId?: string;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  modal: NgbModalRef;
  productForm: FormGroup;
  isSubmitted = false;
  basketAddresses: Address[];
  validators = ADD_NEW_PRODUCT_VALIDATORS;

  ngOnInit() {
    this.productForm = new FormGroup({
      quantity: new FormControl(0),
      sku: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'change',
      }),
      boxLabel: new FormControl('', [Validators.maxLength(60)]),
      measurementWidth: new FormControl(),
      measurementHeight: new FormControl(),
      measurementDiameter: new FormControl(),
      measurementErrorInfo: new FormControl(),
    });

    this.currentCamCard$ = this.camCardsFacade.currentCamCard$;

    this.product$ = this.sku$
      .pipe(
        switchMap(sku =>
          sku === FAKE_SKU
            ? of(createFakeProduct())
            : this.shoppingFacade.product$(sku, ModalAddNewProductComponent.REQUIRED_COMPLETENESS_LEVEL).pipe(
                catchError(() => of(createFakeProduct())),
                map(product => (product?.failed ? createFakeProduct(product) : product))
              )
        )
      )
      .pipe(
        tap(({ minOrderQuantity, maxOrderQuantity }) => {
          const quantityControl = this.productForm?.get('quantity');
          quantityControl?.setValidators([Validators.min(minOrderQuantity), Validators.max(maxOrderQuantity)]);
          quantityControl?.setValue(0);
          quantityControl?.updateValueAndValidity();
        })
      );

    this.productIsLoading$ = this.sku$.pipe(
      switchMap(sku =>
        sku === FAKE_SKU
          ? of(false)
          : this.shoppingFacade.productNotReady$(sku, ProductCompletenessLevel.List).pipe(catchError(() => of(false)))
      )
    );

    this.productHasValidSku$ = this.product$.pipe(
      map(product => this.isSubmitted || (!product?.failed && product?.availability)),
      tap(hasValidSku => {
        const skuControl = this.productForm?.get('sku');
        const required = isEmpty(skuControl?.value) || skuControl?.value === FAKE_SKU;
        const validSku = !hasValidSku && !isEmpty(skuControl?.value);

        skuControl.setErrors(!required && !validSku ? undefined : { required, validSku });
      })
    );

    this.productRequiresMeasurement$ = this.product$.pipe(
      map(product => ProductHelper.getRequiresMeasurement(product)),
      tap(() => {
        this.productForm?.get('measurementWidth').reset();
        this.productForm?.get('measurementHeight').reset();
        this.productForm?.get('measurementDiameter').reset();
        this.productForm?.get('measurementErrorInfo').reset();
      })
    );

    this.productFormIsDisabled$ = this.productForm?.valueChanges?.pipe(
      withLatestFrom(this.product$, this.sku$, this.productHasValidSku$),
      map(([, product, sku, productWithValidSku]) =>
        sku === FAKE_SKU
          ? true
          : ProductHelper.disableIfNoMeasurements(product, this.productForm) ||
            !productWithValidSku ||
            !ProductHelper.validateFilterArea(product, this.productForm)
      )
    );

    this.productForm
      ?.get('sku')
      ?.valueChanges?.pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(sku => {
        this.sku$.next(sku || FAKE_SKU);
      });

    if (this.addToOrder) {
      this.shoppingFacade.basketAddresses$.pipe(takeUntil(this.destroy$)).subscribe((basketAddresses: Address[]) => {
        this.basketAddresses = basketAddresses;
      });
      this.shoppingFacade.productUpdated$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(() => {
        this.hide();
      });
      this.shoppingFacade.productAdded$.pipe(whenTruthy(), take(1)).subscribe(() => {
        this.hide();
      });
    } else {
      this.currentCamCard$?.pipe(takeUntil(this.destroy$)).subscribe(camCard => {
        this.rootCamCardId = camCard?.id || undefined;
      });
    }
  }

  ngAfterViewInit() {
    this.sku$.next(FAKE_SKU);
  }

  submitForm() {
    if (this.productForm.valid) {
      const sku = this.productForm?.get('sku')?.value ? String(this.productForm?.get('sku').value) : undefined;
      const quantity = this.productForm?.get('quantity')?.value ? Number(this.productForm?.get('quantity')?.value) : 1;
      const label = this.productForm?.get('boxLabel')?.value
        ? String(this.productForm?.get('boxLabel').value)
        : undefined;
      const comment: CamCardItemComment = label ? { label } : undefined;
      const lineItemAttributes = AttributeHelper.calculateAttrsToAddFromForm(this.productForm);

      this.isSubmitted = true;

      if (this.addToOrder) {
        const type = this.order?.id?.split('_')?.[0];

        if (this.order?.id && type !== 'emptyBucket' && this.order?.shipToAddress) {
          this.addToExistingOrder(sku, quantity, this.order.shipToAddress, lineItemAttributes);
        } else {
          const deliveryAddress = this.order.shipToAddressFull as Address;
          this.addToNewOrder(sku, quantity, deliveryAddress, this.order.id, lineItemAttributes);
        }
      } else {
        const measurement = {
          width: this.productForm.get('measurementWidth').value,
          height: this.productForm.get('measurementHeight').value,
          diameter: this.productForm.get('measurementDiameter').value,
        };
        this.camCardsFacade.addProductToCamCard(this.rootCamCardId, sku, quantity, comment, measurement, 0, true);
        this.hide();
        this.reset();
      }
    } else {
      markAsDirtyRecursive(this.productForm);
    }
  }

  addToExistingOrder(sku, quantity, shipToAddress, lineItemAttributes) {
    this.shoppingFacade.addProductToBasket(sku, quantity, this.shippingMethodId, shipToAddress, lineItemAttributes);
  }

  addToNewOrder(sku, quantity, deliveryAddress, bucketId, lineItemAttributes) {
    if (this.isNewAddress(deliveryAddress)) {
      this.shoppingFacade.addProductToBucket(
        deliveryAddress,
        this.order.shippingMethod,
        sku,
        quantity,
        this.order.basket,
        {
          ...this.order,
        },
        lineItemAttributes,
        bucketId
      );
    } else {
      this.shoppingFacade.addProductToBucketWithUrn(
        this.getUrn(deliveryAddress),
        this.getId(deliveryAddress),
        this.order.shippingMethod,
        sku,
        quantity,
        this.order.basket,
        lineItemAttributes
      );
    }
  }

  getUrn(currentAddress: Address): string {
    return AddressHelper.getUrn(currentAddress, this.basketAddresses);
  }

  getId(currentAddress: Address): string {
    return AddressHelper.getId(currentAddress, this.basketAddresses);
  }

  isNewAddress(currentAddress: Address): boolean {
    return AddressHelper.isNewAddress(currentAddress, this.basketAddresses);
  }

  reset() {
    this.sku$.next(FAKE_SKU);
    this.productForm?.reset();
    this.isSubmitted = false;
  }

  /** close modal */
  hide() {
    this.modal?.close ? this.modal.close() : this.dialog.closeAll();
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
