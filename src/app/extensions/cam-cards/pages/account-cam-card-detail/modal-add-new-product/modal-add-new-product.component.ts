import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { QuickAddProduct } from 'camfil-pwa/models/camfil-quick-add-product/camfil-quick-add-product.model';
import { isEmpty } from 'lodash-es';
import { Observable, ReplaySubject, Subject, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Address } from 'ish-core/models/address/address.model';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.helper';
import { ProductView, createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product, ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

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
  constructor(private shoppingFacade: ShoppingFacade, public dialog: MatDialog) {}

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;

  private destroy$ = new Subject();

  sku$ = new ReplaySubject<string>(1);
  productIsLoading$: Observable<boolean>;
  product$: Observable<ProductView>;
  productHasValidSku$: Observable<boolean>;
  productRequiresMeasurement$: Observable<boolean>;
  productFormIsDisabled$: Observable<boolean>;
  currentCamCard$: Observable<CamCard>;

  @Input() addToOrder = false;

  @Output() submitProductAdd = new EventEmitter<QuickAddProduct>();

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  modal: NgbModalRef;
  productForm: FormGroup;
  isSubmitted = false;
  basketAddresses: Address[];
  validators = ADD_NEW_PRODUCT_VALIDATORS;

  ngOnInit() {
    this.productForm = new FormGroup({
      quantity: new FormControl(0, { updateOn: 'blur' }),
      sku: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'change',
      }),
      boxLabel: new FormControl('', [Validators.maxLength(60)]),
      measurementWidth: new FormControl(),
      measurementHeight: new FormControl(),
      measurementDiameter: new FormControl(),
      measurementDepth: new FormControl({ disabled: true }),
      measurementErrorInfo: new FormControl(),
    });

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
        this.productForm?.get('measurementDepth').reset();
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
  }

  ngAfterViewInit() {
    this.sku$.next(FAKE_SKU);
  }

  submitForm() {
    /* TODO: Replace with event emitters and submit in parent components
        To be replaced in:
        1. camfil-checkout-bucket ---- done
        2. account-cam-card-detail-toolbar ---- done
        3. camfil-requisition-detail-toolbar
    */
    if (this.productForm.valid) {
      const sku = this.productForm?.get('sku')?.value ? String(this.productForm?.get('sku').value) : undefined;
      const quantity = this.productForm?.get('quantity')?.value ? Number(this.productForm?.get('quantity')?.value) : 1;
      const label = this.productForm?.get('boxLabel')?.value
        ? String(this.productForm?.get('boxLabel').value)
        : undefined;
      const comment: CamCardItemComment = label ? { label } : undefined;
      const lineItemAttributes = AttributeHelper.calculateAttrsToAddFromForm(this.productForm);
      const measurement = {
        width: this.productForm.get('measurementWidth').value,
        height: this.productForm.get('measurementHeight').value,
        diameter: this.productForm.get('measurementDiameter').value,
        depth: this.productForm.get('measurementDepth').value,
      };

      this.isSubmitted = true;

      console.log({ comment });
      this.submitProductAdd.emit({
        sku,
        quantity,
        lineItemAttributes,
        boxLabel: comment,
        measurements: measurement,
      });
    } else {
      markAsDirtyRecursive(this.productForm);
    }
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
