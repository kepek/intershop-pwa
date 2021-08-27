import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioButton } from '@angular/material/radio';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import slugify from 'slugify';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCardHelper } from '../../models/cam-card/cam-card.helper';
import {
  CamCard,
  CamCardAddress,
  CamCardItemComment,
  CamCardMeasurement,
  CreateCamCardData,
  SelectCamCardOption,
} from '../../models/cam-card/cam-card.model';

import { CreateProductCamCardModalComponent } from './create-product-cam-card-modal/create-product-cam-card-modal.component';

/**
 * The cam cards select modal displays a list of cam_cards. The user can select one cam cards  or enter a name for a new cam card in order to add or move an item to the selected cam cards .
 */
@Component({
  selector: 'camfil-add-product-to-cam-card-modal',
  templateUrl: './add-product-to-cam-card-modal.component.html',
  styleUrls: ['./add-product-to-cam-card-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductToCamCardModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() product: Product;
  @Input() quantity: number;

  /**
   * changes the some logic and the translations keys between add or move a product (default: 'add')
   */
  @Input() addMoveProduct: 'add' | 'move' = 'add';

  /**
   * submit success event
   */
  @Output() submitEmitter = new EventEmitter<{ id: string; name: string }>();
  // search
  isActive = false;
  inputSearchTerm = '';
  searchInputFilter = new FormControl();

  camCardOptions: SelectCamCardOption[];
  camCardOptionsAll: SelectCamCardOption[];

  showForm: boolean;
  newCamCardInitValue = '';

  modal: NgbModalRef;

  private destroy$ = new Subject<void>();

  quantityForm: FormGroup;

  shouldClearNewSegment = false;
  newSegmentForm: FormGroup;
  camCardSelected: string;
  segmentSelected: string;
  readonly newSegmentValue = 'newSubCamCard';
  showNewSegment = false;

  camCards: CamCard[];

  currentCamCard$: Observable<CamCard>;
  currentCamCard: CamCard;

  currentSubCamCardName: string;
  useSubCamCard = false;
  camCardsLoading$: Observable<boolean>;
  tabindex = 0;

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

  rootCamCardAddress?: CamCardAddress;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;
  validateFilterArea = ProductHelper.validateFilterArea;
  disableActionButton = ProductHelper.disableActionButton;
  constructor(
    public dialog: MatDialog,
    protected fb: FormBuilder,
    protected camCardsFacade: CamCardsFacade,
    protected router: Router,
    protected shoppingFacade: ShoppingFacade,
    private cdr: ChangeDetectorRef
  ) {}

  protected init() {
    this.formsInit();
    this.determineSelectOptions();

    this.currentCamCard$ = this.camCardsFacade.currentCamCard$;
    this.currentCamCard$.pipe(takeUntil(this.destroy$)).subscribe(currentCamCard => {
      this.currentCamCard = currentCamCard;
      if (this.shouldClearNewSegment && !currentCamCard) {
        this.shouldClearNewSegment = false;
        this.resetNewSegmentForm();
      }
    });

    this.camCardsLoading$ = this.camCardsFacade.camCardsLoading$;

    this.searchInputFilter.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      this.applyFilter(filterValue);
    });
  }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.quantity && this.quantityForm) {
      this.quantityForm.patchValue({ quantity: changes.quantity.currentValue });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private determineSelectOptions() {
    this.camCardsFacade.camCard$.pipe(takeUntil(this.destroy$)).subscribe(camCards => {
      if (camCards && camCards.length > 0) {
        const realCamCards = CamCardHelper.getRealCamCards(camCards);
        this.camCards = realCamCards;

        this.camCardOptionsAll = realCamCards
          .map(camCard => ({
            value: camCard.id,
            label: camCard.name,
            nextDelivery: camCard.nextDeliveryDate,
            orderLabel: camCard.orderLabel,
            invoiceLabel: camCard.invoiceLabel,
            deliveryAddressDisplay: this.formatDeliveryAddress(camCard.deliveryAddress),
            deliveryAddress: camCard.deliveryAddress,
            subCamCards: camCard.subCamCards,
            boxLabels: camCard.camCardItems.map(item => item.comment.label),
            camCardItems: camCard.camCardItems,
            customer: camCard.customer,
            name: camCard.name,
          }))
          .sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
          });

        this.camCardOptions = this.camCardOptionsAll;
      } else {
        this.camCardOptions = [];
      }
    });
  }

  private formsInit() {
    this.newSegmentForm = this.fb.group({
      newCamCard: [{ value: '' }, [Validators.required, Validators.maxLength(30)]],
    });
    this.quantityForm = new FormGroup({
      quantity: new FormControl(this.quantity),
      boxLabel: new FormControl('', Validators.maxLength(40)),
      measurementWidth: new FormControl(),
      measurementHeight: new FormControl(),
      measurementDiameter: new FormControl(),
      measurementErrorInfo: new FormControl(),
    });
  }

  applyFilter(filterValue: string) {
    this.camCardOptions = this.camCardOptionsAll.filter(option => {
      const fields = [
        option.label,
        option.orderLabel,
        option.invoiceLabel,
        option.deliveryAddressDisplay,
        option.subCamCards,
        option.boxLabels,
      ];
      return this.searchBy(filterValue, fields);
    });
  }

  searchBy(filter, fields) {
    return JSON.stringify(fields).trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1;
  }

  createCamCardAndAdd({ camCard, quantity, boxLabel, edit, subCamCard, measurement }: CreateCamCardData) {
    if (subCamCard) {
      this.camCardsFacade.addToNewCamCardWithNewSubCamCard(
        camCard,
        subCamCard,
        this.product.sku,
        quantity,
        boxLabel,
        measurement,
        edit
      );
    } else {
      this.camCardsFacade.addProductToNewCamCardAndEdit(
        camCard,
        this.product.sku,
        quantity,
        boxLabel,
        measurement,
        edit
      );
    }
    this.dialog.closeAll();
    this.hide();
  }

  getSelectedCamCard = camCardId => this.camCardOptions.find(camCard => camCard.value === camCardId);

  getSelectedCamCardItem(camCardId) {
    const currentCamCard = this.getSelectedCamCard(camCardId);
    return currentCamCard ? currentCamCard.camCardItems : [];
  }

  isAddedToExistingSubCamCard = () => this.segmentSelected && this.segmentSelected !== this.newSegmentValue;

  isAddedToNewSubCamCard = () => this.segmentSelected && this.segmentSelected === this.newSegmentValue;

  addToNewSubCamCard(product: Product, quantity?: number, boxLabel?: string, measurement?: CamCardMeasurement) {
    if (this.newSegmentForm.valid) {
      const newSegmentValue = this.newSegmentForm.get('newCamCard').value;
      const rootCamCard = this.camCards.find(camCard => camCard.id === this.camCardSelected);
      this.useSubCamCard = true;
      this.currentSubCamCardName = newSegmentValue;

      const newSubCamCard = {
        name: newSegmentValue,
        deliveryAddress: this.rootCamCardAddress,
        customer: rootCamCard.customer,
      };

      this.camCardsFacade.addProductToNewSubCamCard(
        newSubCamCard,
        rootCamCard,
        product.sku,
        quantity,
        boxLabel,
        measurement,
        false
      );
      this.shouldClearNewSegment = true;
    } else {
      markAsDirtyRecursive(this.newSegmentForm);
    }
  }

  addToCamcard() {
    const quantity = this.quantityForm.get('quantity').value;
    const boxLabel = this.quantityForm.get('boxLabel').value;
    const measurement = {
      width: this.quantityForm.get('measurementWidth').value,
      height: this.quantityForm.get('measurementHeight').value,
      diameter: this.quantityForm.get('measurementDiameter').value,
    };
    const requiresMeasurement = ProductHelper.getRequiresMeasurement(this.product);

    if (requiresMeasurement && !Object.values(measurement).find(e => e)) {
      this.quantityForm.patchValue({ measurementErrorInfo: true });
      return;
    }
    if (!this.disableIfNoMeasurements()) {
      if (this.camCardSelected && this.isAddedToNewSubCamCard()) {
        this.addToNewSubCamCard(this.product, quantity, boxLabel, measurement);
        return;
      }

      if (this.camCardSelected) {
        if (this.isAddedToExistingSubCamCard()) {
          const rootCamCard = this.camCards.find(camCard => camCard.id === this.camCardSelected);
          this.camCardsFacade.addProductToSubCamCard(
            this.segmentSelected,
            this.camCardSelected,
            this.product.sku,
            quantity,
            boxLabel,
            measurement
          );

          this.currentSubCamCardName = rootCamCard.subCamCards.find(sub => sub.id === this.segmentSelected).name;
          this.useSubCamCard = true;
        } else {
          const comment: CamCardItemComment = { label: boxLabel };
          this.camCardsFacade.addProductToCamCard(
            this.camCardSelected,
            this.product.sku,
            quantity,
            comment,
            measurement
          );
          this.useSubCamCard = false;
        }
      }
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
      this.resetNewSegmentForm();
    }
    this.camCardSelected = camCardID;
    this.tabindex = -1;
    this.rootCamCardAddress = this.getSelectedCamCard(this.camCardSelected).deliveryAddress;
  }

  resetNewSegmentForm() {
    this.newSegmentForm.reset('newCamCard');
    this.segmentSelected = undefined;
    this.showNewSegment = false;
  }

  showNewSegmant() {
    this.showNewSegment = true;
    this.segmentSelected = this.newSegmentValue;

    setTimeout(() => {
      const selectedSectionId = `${slugify('new-section', '.')}.${slugify(this.camCardSelected, '.')?.toLowerCase()}`;
      const newSegment = document.getElementById(selectedSectionId) as HTMLElement;
      newSegment?.focus();
      this.cdr.detectChanges();
    });
  }

  unselectRadio(event, el: MatRadioButton) {
    if (el.checked && event.target.type !== 'text') {
      event.preventDefault();
      this.segmentSelected = undefined;
      el.checked = false;
    }
  }

  goToCamcard() {
    const rootCamCardId = this.currentCamCard.rootCamCard || this.currentCamCard.id;

    this.router.navigate([`/account/camcards/${rootCamCardId}`]);
    this.hide();
    this.shoppingFacade.hideSearchBox();
  }

  disableIfNoMeasurements() {
    return ProductHelper.disableIfNoMeasurements(this.product, this.quantityForm);
  }

  /** close modal */
  hide() {
    this.modal.close();
    this.camCardsFacade.unSelectCamCard();
  }

  /** open modal */
  show() {
    this.quantityForm?.controls.boxLabel.setValue('');
    this.quantityForm?.controls.quantity.setValue(this.quantity);
    this.camCardsFacade.unSelectCamCard();
    this.showForm = true;
    return this.modalTemplate;
  }

  openModal(modal: CreateProductCamCardModalComponent) {
    const dialogRef = this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
    dialogRef
      .afterOpened()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        modal.setFocusOnCamCardNameInputField();
      });
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
