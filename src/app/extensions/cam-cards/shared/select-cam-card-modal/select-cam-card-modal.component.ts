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
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Product } from 'ish-core/models/product/product.model';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard, CamCardCustomer, CamCardItem } from '../../models/cam-card/cam-card.model';

import { CreateCamCardModalComponent } from './create-cam-card-modal/create-cam-card-modal.component';

interface SelectCamCardOption extends SelectOption {
  nextDelivery: string;
  orderLabel?: string;
  invoiceLabel?: string;
  deliveryAddress?: string;
  subCamCards?: CamCard[];
  boxLabels?: string[];
  camCardItems?: CamCardItem[];
  customer: CamCardCustomer;
  name: string;
}

interface CreateCamCardData {
  camCard: CamCard;
  quantity?: number;
  boxLabel?: string;
  edit?: boolean;
  subCamCard?: CamCard;
}

/**
 * The cam cards select modal displays a list of cam_cards. The user can select one cam cards  or enter a name for a new cam card in order to add or move an item to the selected cam cards .
 */
@Component({
  selector: 'camfil-select-cam-card-modal',
  templateUrl: './select-cam-card-modal.component.html',
  styleUrls: ['./select-cam-card-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCamCardModalComponent implements OnInit, OnDestroy {
  @Input() product: Product;

  /**
   * changes the some logic and the translations keys between add or move a product (default: 'add')
   */
  @Input() addMoveProduct: 'add' | 'move' = 'add';

  /**
   * submit success event
   */
  @Output() submitEmitter = new EventEmitter<{ id: string; title: string }>();

  // search
  isActive = false;
  inputSearchTerm = '';
  searchInputFilter = new FormControl();

  camCardOptions: SelectCamCardOption[];
  camCardOptionsAll: SelectCamCardOption[];

  showForm: boolean;
  newCamCardInitValue = '';

  modal: NgbModalRef;

  idAfterCreate = '';
  private destroy$ = new Subject<void>();

  quantityForm: FormGroup;

  newSegmentForm: FormGroup;
  camCardSelected: string;
  segmentSelected: string;
  readonly newSegmentValue = 'newSubCamCard';
  showNewSegment = false;

  created$: Observable<{ name: string; id: string }>;
  created: { name: string; id: string };

  newSegmentValidator = [
    {
      error: 'required',
      message: 'camfil.modal.addToCamcard.camcard.new_segment.error.required',
    },
    {
      error: 'maxlength',
      message: 'camfil.modal.addToCamcard.camcard.new_segment.error.maxLength',
    },
  ];

  camCardAddressEntry = {
    id: '',
    urn: '',
    addressName: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    postalCode: '',
    city: '',
    country: '',
    countryCode: '',
    phoneHome: '',
    invoiceToAddress: false,
    shipToAddress: false,
  };

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(
    private fb: FormBuilder,
    private camCardsFacade: CamCardsFacade,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.determineSelectOptions();
    this.formsInit();

    this.created$ = this.camCardsFacade.created$;
    this.created$.pipe(takeUntil(this.destroy$)).subscribe(created => {
      this.created = created;
    });

    this.camCardsFacade.currentCamCard$
      .pipe(takeUntil(this.destroy$))
      .subscribe(camCard => (this.idAfterCreate = camCard && camCard.id));

    this.searchInputFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      this.applyFilter(filterValue);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private determineSelectOptions() {
    this.camCardsFacade.camCard$.pipe(takeUntil(this.destroy$)).subscribe(camCards => {
      if (camCards && camCards.length > 0) {
        this.camCardOptionsAll = camCards.map(camCard => ({
          value: camCard.id,
          label: camCard.name,
          nextDelivery: camCard.nextDeliveryDate,
          orderLabel: camCard.orderLabel,
          invoiceLabel: camCard.invoiceLabel,
          deliveryAddress: this.formatDeliveryAddress(camCard.deliveryAddress),
          subCamCards: camCard.subCamCards,
          boxLabels: camCard.camCardItems.map(item => item.comment.label),
          camCardItems: camCard.camCardItems,
          customer: camCard.customer,
          name: camCard.name,
        }));

        this.camCardOptions = this.camCardOptionsAll;
      } else {
        this.camCardOptions = [];
      }
    });
  }

  private formsInit() {
    this.newSegmentForm = this.fb.group({
      newCamCard: [{ value: '' }, [Validators.required, Validators.maxLength(10)]],
    });

    this.quantityForm = new FormGroup({
      quantity: new FormControl(this.product.minOrderQuantity),
      boxLabel: new FormControl(),
    });
  }

  applyFilter(filterValue: string) {
    this.camCardOptions = this.camCardOptionsAll.filter(option => {
      const fields = [
        option.label,
        option.orderLabel,
        option.invoiceLabel,
        option.deliveryAddress,
        option.subCamCards,
        option.boxLabels,
      ];
      return this.searchBy(filterValue, fields);
    });
  }

  searchBy(filter, fields) {
    return JSON.stringify(fields).trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1;
  }

  createCamcardAndAdd({ camCard, quantity, boxLabel, edit, subCamCard }: CreateCamCardData) {
    if (subCamCard) {
      this.camCardsFacade.addToNewCamCardWithNewSubCamCard(
        camCard,
        subCamCard,
        this.product.sku,
        quantity,
        boxLabel,
        edit
      );
    } else {
      this.camCardsFacade.addProductToNewCamCardAndUpdate(camCard, this.product.sku, quantity, boxLabel, edit);
    }

    this.dialog.closeAll();
    this.hide();
  }

  getSelectedCamCard = camCardId => this.camCardOptions.find(camCard => camCard.value === camCardId);

  getSelectedCamCardItem = camCardId => {
    const currentCamCard = this.getSelectedCamCard(camCardId);
    return currentCamCard ? currentCamCard.camCardItems : [];
  };

  isAddedToExistingSubCamCard = () => this.segmentSelected && this.segmentSelected !== this.newSegmentValue;

  isAddedToNewSubCamCard = () => this.segmentSelected && this.segmentSelected === this.newSegmentValue;

  addToNewSubCamCard(quantity?: number, boxLabel?: string) {
    if (this.newSegmentForm.valid) {
      const newSegmentValue = this.newSegmentForm.get('newCamCard').value;

      const newSubCamCard = {
        name: newSegmentValue,
        deliveryAddress: this.camCardAddressEntry,
      };

      this.camCardsFacade.addProductToNewSubCamCard(
        newSubCamCard,
        this.camCardSelected,
        this.product.sku,
        quantity,
        boxLabel,
        false
      );
    } else {
      markAsDirtyRecursive(this.newSegmentForm);
    }
  }

  addToCamcard() {
    const quantity = this.quantityForm.get('quantity').value;
    const boxLabel = this.quantityForm.get('boxLabel').value;

    if (this.camCardSelected && this.isAddedToNewSubCamCard()) {
      this.addToNewSubCamCard(quantity, boxLabel);
      return;
    }

    if (this.camCardSelected) {
      const camCardToAdd = this.isAddedToExistingSubCamCard() ? this.segmentSelected : this.camCardSelected;
      const camCardItems = this.getSelectedCamCardItem(camCardToAdd);

      this.camCardsFacade.addProductToCamCardAndUpdate(
        this.camCardSelected,
        this.product.sku,
        camCardItems,
        quantity,
        boxLabel
      );
    }
  }

  getValueOrEmpty(value: string, last?: boolean) {
    return value ? value + (last ? '' : ', ') : '';
  }

  formatDeliveryAddress(deliveryAddress) {
    let formattedAddress = '';

    if (deliveryAddress) {
      const { company, addressLine1, city } = deliveryAddress;

      formattedAddress =
        this.getValueOrEmpty(company, !addressLine1 && !city) +
        this.getValueOrEmpty(addressLine1, !city) +
        this.getValueOrEmpty(city, true);
    }

    return formattedAddress;
  }

  selectCamCard(camCardID) {
    if (this.camCardSelected !== camCardID) {
      this.newSegmentForm.reset('newCamCard');
    }
    this.camCardSelected = camCardID;
  }

  showNewSegmant() {
    this.showNewSegment = true;
  }

  goToCamcard() {
    this.router.navigate([`/account/cam-cards/${this.idAfterCreate}`]);
    this.camCardsFacade.resetCreatedCamCard();
  }

  /** close modal */
  hide() {
    this.modal.close();
    this.camCardsFacade.resetCreatedCamCard();
  }

  /** open modal */
  show() {
    this.camCardsFacade.resetCreatedCamCard();
    this.showForm = true;
    return this.modalTemplate;
  }

  openModal(modal: CreateCamCardModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
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
