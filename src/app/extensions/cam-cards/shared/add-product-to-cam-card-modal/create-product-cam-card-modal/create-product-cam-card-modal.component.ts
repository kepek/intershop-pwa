import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil, takeWhile } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Country } from 'ish-core/models/country/country.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import {
  CamCard,
  CamCardAddress,
  CamCardCustomer,
  CamCardCustomersAddresses,
  CamCardMeasurement,
} from '../../../models/cam-card/cam-card.model';

import { CREATE_CAMCARD_VALIDATORS } from './validators';

export interface CreateProductCamCardAndEmitter {
  camCard: CamCard;
  quantity?: number;
  boxLabel?: string;
  edit?: boolean;
  subCamCard?: CamCard;
  measurement?: CamCardMeasurement;
}

@Component({
  selector: 'camfil-create-product-cam-card-modal',
  templateUrl: './create-product-cam-card-modal.component.html',
  styleUrls: ['./create-product-cam-card-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductCamCardModalComponent implements OnInit, OnDestroy {
  @Input() product: Product;
  @Input() rootCamCardAddress: CamCardAddress;
  @Input() parentForm: FormGroup;

  @Output() createAndEditEmitter = new EventEmitter<CreateProductCamCardAndEmitter>();
  @Output() createAndContinueEmitter = new EventEmitter<CreateProductCamCardAndEmitter>();

  @ViewChild('name') nameInput: ElementRef;
  @ViewChild('newSubCamCard') newSubCamCardInput: ElementRef;
  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;
  @ViewChild(ZipCodeComponent) zipCodeComponent: ZipCodeComponent;

  modal: NgbModalRef;
  camCardForm: FormGroup;
  quantityForm: FormGroup;
  validators = CREATE_CAMCARD_VALIDATORS;
  addresses$: Observable<CamCardCustomersAddresses>;
  customers$: Observable<CamCardCustomer[]>;
  countries$: Observable<Country[]>;
  customers: CamCardCustomer[];
  defaultCountryCode: string;
  showNewSegment = false;

  validateFilterArea = ProductHelper.validateFilterArea;
  setMaxLengthValidation = ProductHelper.setMaxLengthValidation;
  disableActionButton = ProductHelper.disableActionButton;
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private camCardsFacade: CamCardsFacade,
    private appFacade: AppFacade,
    private cdr: ChangeDetectorRef,
    private camfilConfigurationFacade: CamfilConfigurationFacade
  ) {}

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }

  get customerId() {
    return this.camCardForm?.get('customerSelect')?.value || '';
  }

  initObservables() {
    this.countries$ = this.appFacade.countries$();
    this.addresses$ = this.camCardsFacade.addresses$;
    this.customers$ = this.camCardsFacade.customers$;
  }

  initCountryCode() {
    this.appFacade.getCountryCodeByChannel$
      .pipe(takeUntil(this.destroy$))
      .subscribe(code => (this.defaultCountryCode = code));
  }

  initForms() {
    this.camCardForm = this.fb.group({
      name: ['', [Validators.required]],
      customerSelect: [''],
      orderMark: [''],
      invoiceMark: [''],
      deliveryAddressSelect: ['', []],
      company: [''],
      addressLine1: [''],
      addressLine2: [''],
      citySelect: ['', Validators.required],
      zipCode: [''],
      area: [{ value: '', disabled: true }, Validators.required],
      countryCode: [{ value: this.defaultCountryCode }, [Validators.maxLength(35)]],
      newCamCard: ['', [Validators.maxLength(30)]],
    });

    this.camfilConfigurationFacade.zipCodeRegExp$.pipe(take(1), takeUntil(this.destroy$)).subscribe(zipCodeRegExp => {
      this.camCardForm.get('zipCode').setValidators([Validators.required, Validators.pattern(zipCodeRegExp)]);
    });

    this.quantityForm = this.parentForm
      ? this.parentForm
      : new FormGroup({
          quantity: new FormControl(0),
          boxLabel: new FormControl('', Validators.maxLength(60)),
        });
  }

  initCustomers() {
    this.customers$
      .pipe(
        takeWhile(() => !this.customers?.length),
        takeUntil(this.destroy$)
      )
      .subscribe(customers => {
        this.customers = customers;
        this.setDefaultCustomer();
      });
  }

  init() {
    this.initObservables();
    this.initCountryCode();
    this.initForms();
    this.initCustomers();
  }

  ngOnInit() {
    this.init();
  }

  setFocusOnCamCardNameInputField() {
    if (this.customers.length === 1) {
      setTimeout(() => {
        this.nameInput?.nativeElement.focus();
        this.cdr.detectChanges();
      });
    }
  }

  setDefaultCustomer() {
    if (this.customers.length === 1) {
      const id = this.customers[0]?.id;
      this.camCardForm.patchValue({
        customerSelect: id,
      });
    }
  }

  addSubLevel() {
    this.showNewSegment = true;
    setTimeout(() => {
      this.newSubCamCardInput?.nativeElement.focus();
      this.cdr.detectChanges();
    });
  }

  pickAddress(event) {
    const id = event.value;
    this.addresses$.subscribe(addresses => {
      const selectedAddress = addresses[this.customerId]?.filter(element => element.id === id)[0];
      if (selectedAddress) {
        this.camCardForm.patchValue({
          company: selectedAddress.companyName1,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          zipCode: selectedAddress.postalCode,
          area: selectedAddress.city,
          countryCode: selectedAddress.countryCode || this.defaultCountryCode,
        });
        this.zipCodeComponent.checkZipCode();
      }
    });
  }

  create() {
    const customerId = this.customerId;

    this.customers.map(item => item.id === customerId);
    const camCard = {
      name: this.camCardForm.get('name').value,
      orderLabel: this.camCardForm.get('orderMark').value,
      invoiceLabel: this.camCardForm.get('invoiceMark').value,
      customer: {
        id: customerId,
        customerNo: this.customers.find(item => item.id === customerId).customerNo,
      },
      deliveryAddress: {
        ...this.rootCamCardAddress,
        companyName1: this.camCardForm.get('company').value,
        addressLine1: this.camCardForm.get('addressLine1').value,
        addressLine2: this.camCardForm.get('addressLine2').value,
        postalCode: this.camCardForm.get('zipCode').value,
        city: this.camCardForm.get('area').value,
        countryCode: this.camCardForm.get('countryCode').value || this.defaultCountryCode,
      },
      reminderFlag: 1,
    };

    const quantity = this.quantityForm.get('quantity').value;
    const boxLabel = this.quantityForm.get('boxLabel').value;
    const measurement = {
      width: this.quantityForm.get('measurementWidth').value,
      height: this.quantityForm.get('measurementHeight').value,
      diameter: this.quantityForm.get('measurementDiameter').value,
      depth: this.quantityForm.get('measurementDepth').value,
    };

    return {
      camCard,
      quantity,
      boxLabel,
      measurement,
    };
  }

  emitCamCardData(edit) {
    if (this.camCardForm.valid) {
      const newCamCard = this.camCardForm.get('newCamCard').value;
      const customerId = this.customerId;
      const camCardData = this.create();

      const newSubCamCard: CamCard = {
        name: newCamCard,
        deliveryAddress: this.rootCamCardAddress,
        customer: {
          id: customerId,
          customerNo: this.customers.find(item => item.id === customerId).customerNo,
        },
      };

      if (newCamCard) {
        this.createAndEditEmitter.emit({ ...camCardData, edit, subCamCard: newSubCamCard });
      } else {
        this.createAndEditEmitter.emit({ ...camCardData, edit });
      }
    } else {
      markAsDirtyRecursive(this.camCardForm);
    }
  }

  createAndEdit() {
    this.emitCamCardData(true);
  }

  createAndContinue() {
    this.emitCamCardData(false);
  }

  getField(name: string) {
    return this.camCardForm.get(name);
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    this.camCardForm?.reset();
    this.setDefaultCustomer();
    this.showNewSegment = false;

    return this.modalTemplate;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
