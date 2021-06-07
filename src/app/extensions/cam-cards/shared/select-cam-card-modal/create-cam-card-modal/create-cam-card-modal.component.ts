import {
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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { Country } from 'ish-core/models/country/country.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard, CamCardAddress, CamCardCustomer, CamCardMeasurement } from '../../../models/cam-card/cam-card.model';

import { CREATE_CAMCARD_VALIDATORS } from './validators';

export interface CamCardCreateAndEmitter {
  camCard: CamCard;
  quantity?: number;
  boxLabel?: string;
  edit?: boolean;
  subCamCard?: CamCard;
  measurement?: CamCardMeasurement;
}

@Component({
  selector: 'camfil-create-cam-card-modal',
  templateUrl: './create-cam-card-modal.component.html',
  styleUrls: ['./create-cam-card-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCamCardModalComponent implements OnInit, OnDestroy {
  @Input() product: Product;
  @Input() rootCamCardAddress: CamCardAddress;
  @Input() parentForm: FormGroup;
  private destroy$ = new Subject();

  modal: NgbModalRef;

  camCardForm: FormGroup;
  quantityForm: FormGroup;

  validators = CREATE_CAMCARD_VALIDATORS;

  addresses$: Observable<CamCardAddress[]>;
  customers$: Observable<CamCardCustomer[]>;
  countries$: Observable<Country[]>;
  customers: CamCardCustomer[];

  defaultCountryCode: string;
  showNewSegment = false;

  countryChangeDetect$: Subject<boolean> = new Subject();

  @Output() createAndEditEmitter = new EventEmitter<CamCardCreateAndEmitter>();
  @Output() createAndContinueEmitter = new EventEmitter<CamCardCreateAndEmitter>();

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(
    private fb: FormBuilder,
    private camCardsFacade: CamCardsFacade,
    private appFacade: AppFacade,
    private accountFacade: AccountFacade
  ) {}

  ngOnInit() {
    this.appFacade.getCountryByChannel$
      .pipe(takeUntil(this.destroy$))
      .subscribe(code => (this.defaultCountryCode = code));

    this.countries$ = this.appFacade.countries$();
    this.addresses$ = this.camCardsFacade.addresses$;
    this.customers$ = this.camCardsFacade.customers$;
    this.initForm();

    this.accountFacade.user$.pipe(whenTruthy(), take(1)).subscribe(() => {
      this.customers$.pipe(takeUntil(this.destroy$)).subscribe(customers => {
        this.customers = customers;
        this.setDefaultCustomer();

        if (!customers.length) {
          this.camCardsFacade.loadCustomers();
        }
      });
    });
  }
  setDefaultCustomer() {
    if (this.customers.length === 1) {
      const id = this.customers[0]?.id;
      this.camCardForm.patchValue({
        customerSelect: id,
      });
      this.pickCustomer({ value: id });
    }
  }
  initForm() {
    this.camCardForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(35)]],
      customerSelect: [''],
      orderMark: [''],
      invoiceMark: [''],
      deliveryAddressSelect: ['', []],
      company: ['', [Validators.required]],
      address: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      area: ['', [Validators.required]],
      countryCode: [this.defaultCountryCode, [Validators.required, Validators.maxLength(35)]],
      newCamCard: ['', [Validators.maxLength(30)]],
    });

    this.quantityForm = this.parentForm
      ? this.parentForm
      : new FormGroup({
          quantity: new FormControl(0),
          boxLabel: new FormControl('', Validators.maxLength(60)),
        });
  }

  addSubLevel() {
    this.showNewSegment = true;
  }

  pickCustomer(event) {
    if (event.value) {
      this.camCardsFacade.getDeliveryAddress(event.value);
    }
  }

  pickAddress(event) {
    const id = event.value;
    this.addresses$.subscribe(addresses => {
      const address = addresses.filter(element => element.id === id)[0];
      if (address) {
        this.camCardForm.patchValue({
          company: address.companyName1,
          address: address.addressLine1,
          zipCode: address.postalCode,
          area: address.city,
          countryCode: address.countryCode || this.defaultCountryCode,
        });
      }
    });
  }

  create() {
    const customerId = this.camCardForm.get('customerSelect').value;

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
        addressLine1: this.camCardForm.get('address').value,
        postalCode: this.camCardForm.get('zipCode').value,
        city: this.camCardForm.get('area').value,
        countryCode: this.camCardForm.get('countryCode').value || this.defaultCountryCode,
      },
    };

    const quantity = this.quantityForm.get('quantity').value;
    const boxLabel = this.quantityForm.get('boxLabel').value;
    const measurement = {
      width: this.quantityForm.get('measurementWidth').value,
      height: this.quantityForm.get('measurementHeight').value,
      diameter: this.quantityForm.get('measurementDiameter').value,
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
      const customerId = this.camCardForm.get('customerSelect').value;
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

  disableIfNoMeasurements() {
    return ProductHelper.disableIfNoMeasurements(this.product, this.quantityForm);
  }

  setZipCodeError(event) {
    this.camCardForm.controls.zipCode.setErrors(event);
    this.camCardForm.updateValueAndValidity();
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

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
