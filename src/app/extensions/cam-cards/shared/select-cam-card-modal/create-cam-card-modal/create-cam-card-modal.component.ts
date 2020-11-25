import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { Product } from 'ish-core/models/product/product.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard, CamCardAddress, CamCardCustomer } from '../../../models/cam-card/cam-card.model';

import { CREATE_CAMCARD_VALIDATORS } from './validators';

@Component({
  selector: 'camfil-create-cam-card-modal',
  templateUrl: './create-cam-card-modal.component.html',
  styleUrls: ['./create-cam-card-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCamCardModalComponent implements OnInit, AfterViewInit {
  @Input() product: Product;
  @Input() rootCamCardAddress: CamCardAddress;

  modal: NgbModalRef;

  camCardForm: FormGroup;
  quantityForm: FormGroup;

  validators = CREATE_CAMCARD_VALIDATORS;

  addresses$: Observable<CamCardAddress[]>;
  customers$: Observable<CamCardCustomer[]>;

  showNewSegment = false;

  @Output() createAndEditEmitter = new EventEmitter<{
    camCard: CamCard;
    quantity?: number;
    boxLabel?: string;
    edit?: boolean;
    subCamCard?: CamCard;
  }>();
  @Output() createAndContinueEmitter = new EventEmitter<{
    camCard: CamCard;
    quantity?: number;
    boxLabel?: string;
    edit?: boolean;
    subCamCard?: CamCard;
  }>();

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(private fb: FormBuilder, private camCardsFacade: CamCardsFacade) {
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
    this.addresses$ = this.camCardsFacade.addresses$;
    this.customers$ = this.camCardsFacade.customers$;
  }

  initForm() {
    this.camCardForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(35)]],
      customerSelect: [''],
      orderMark: ['', [Validators.required]],
      invoiceMark: ['', [Validators.required]],
      deliveryAddressSelect: ['', []],
      company: ['', [Validators.required]],
      address: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      area: ['', [Validators.required]],
      newCamCard: ['', [Validators.maxLength(10)]],
    });

    this.quantityForm = new FormGroup({
      quantity: new FormControl(0),
      boxLabel: new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.quantityForm.setValue({ quantity: this.product.minOrderQuantity, boxLabel: '' });
  }

  addSublevel() {
    this.showNewSegment = true;
  }

  pickCustomer(event) {
    this.camCardsFacade.getDeliveryAddress(event.value);
  }

  pickAddress(event) {
    const id = event.value;
    this.addresses$.subscribe(addresses => {
      const address = addresses.filter(element => element.id === id)[0];

      this.camCardForm.patchValue({
        company: address.companyName1,
        address: address.addressLine1,
        zipCode: address.postalCode,
        area: address.city,
      });
    });
  }

  create() {
    const camCard = {
      name: this.camCardForm.get('name').value,
      orderLabel: this.camCardForm.get('orderMark').value,
      invoiceLabel: this.camCardForm.get('invoiceMark').value,
      customer: {
        id: this.camCardForm.get('customerSelect').value,
        customerNo: this.camCardForm.get('customerSelect').value,
      },
      deliveryAddress: {
        ...this.rootCamCardAddress,
        addressLine1: this.camCardForm.get('address').value,
        addressLine2: this.camCardForm.get('company').value,
        postalCode: this.camCardForm.get('zipCode').value,
        city: this.camCardForm.get('area').value,
      },
    };

    const quantity = this.quantityForm.get('quantity').value;
    const boxLabel = this.quantityForm.get('boxLabel').value;

    return {
      camCard,
      quantity,
      boxLabel,
    };
  }

  emitCamCardData(edit) {
    if (this.camCardForm.valid) {
      const newCamCard = this.camCardForm.get('newCamCard').value;
      const camCardData = this.create();

      const newSubCamCard: CamCard = {
        name: newCamCard,
        deliveryAddress: this.rootCamCardAddress,
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
}
