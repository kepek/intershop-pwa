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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Product } from 'ish-core/models/product/product.model';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard } from '../../models/cam-card/cam-card.model';

/**
 * The cam cards select modal displays a list of cam_cards. The user can select one cam cards  or enter a name for a new cam card in order to add or move an item to the selected cam cards .
 */
@Component({
  selector: 'ish-select-cam-card-modal',
  templateUrl: './select-cam-card-modal.component.html',
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

  updateCamCardForm: FormGroup;
  camCardOptions: SelectOption[];

  showForm: boolean;
  newCamCardInitValue = '';

  modal: NgbModalRef;

  idAfterCreate = '';
  private destroy$ = new Subject<void>();

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(
    private ngbModal: NgbModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private camCardsFacade: CamCardsFacade
  ) {}

  ngOnInit() {
    this.determineSelectOptions();
    this.formInit();
    this.camCardsFacade.currentCamCard$
      .pipe(takeUntil(this.destroy$))
      .subscribe(camCard => (this.idAfterCreate = camCard && camCard.id));

    this.translate
      .get('camfil.account.cam_card.new_cam_card.text')
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(res => {
        this.newCamCardInitValue = res;
        this.setDefaultFormValues();
      });
    this.updateCamCardForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(changes => {
      if (changes.camCards !== 'newCamCard') {
        this.updateCamCardForm.get('newCamCard').clearValidators();
      } else {
        this.updateCamCardForm.get('newCamCard').setValidators(Validators.required);
      }
      this.updateCamCardForm.get('newCamCard').updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formInit() {
    this.updateCamCardForm = this.fb.group({
      camCards: [
        this.camCardOptions && this.camCardOptions.length > 0 ? this.camCardOptions[0].value : 'newCamCard',
        Validators.required,
      ],
      newCamCard: [this.newCamCardInitValue, Validators.required],
    });
  }

  private determineSelectOptions() {
    let currentCamCard: CamCard;
    this.camCardsFacade.currentCamCard$.pipe(take(1), takeUntil(this.destroy$)).subscribe(w => (currentCamCard = w));
    this.camCardsFacade.camCard$.pipe(takeUntil(this.destroy$)).subscribe(camCards => {
      if (camCards && camCards.length > 0) {
        this.camCardOptions = camCards.map(camCard => ({
          value: camCard.id,
          label: camCard.title,
        }));
        if (this.addMoveProduct === 'move' && currentCamCard) {
          this.camCardOptions = this.camCardOptions.filter(option => option.value !== currentCamCard.id);
        }
      } else {
        this.camCardOptions = [];
      }
      this.setDefaultFormValues();
    });
  }

  private setDefaultFormValues() {
    if (this.showForm) {
      if (this.camCardOptions && this.camCardOptions.length > 0) {
        this.updateCamCardForm.get('camCards').setValue(this.camCardOptions[0].value);
      } else {
        this.updateCamCardForm.get('camCards').setValue('newCamCard');
      }
      this.updateCamCardForm.get('newCamCard').setValue(this.newCamCardInitValue);
    }
  }

  /** emit results when the form is valid */
  submitForm() {
    if (this.updateCamCardForm.valid) {
      const camCardId = this.updateCamCardForm.get('camCards').value;
      this.submitEmitter.emit({
        id: camCardId !== 'newCamCard' ? camCardId : undefined,
        title:
          camCardId !== 'newCamCard'
            ? this.camCardOptions.find(option => option.value === camCardId).label
            : this.updateCamCardForm.get('newCamCard').value,
      });
      this.showForm = false;
    } else {
      markAsDirtyRecursive(this.updateCamCardForm);
    }
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    this.showForm = true;
    this.setDefaultFormValues();
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }

  get selectedCamCardTitle(): string {
    const selectedValue = this.updateCamCardForm.get('camCards').value;
    if (selectedValue === 'newCamCard') {
      return this.updateCamCardForm.get('newCamCard').value;
    } else {
      return this.camCardOptions.find(camCards => camCards.value === selectedValue).label;
    }
  }

  /** returns the route to the selected cam cards */
  get selectedCamCardRoute(): string {
    const selectedValue = this.updateCamCardForm.get('camCards').value;
    if (selectedValue === 'newCamCard') {
      return `route://account/cam-cards/${this.idAfterCreate}`;
    } else {
      return `route://account/cam-cards/${selectedValue}`;
    }
  }

  /** activates the input field to create a new cam cards */
  get newCamCardDisabled() {
    const selectedCamCard = this.updateCamCardForm.get('camCards').value;
    return selectedCamCard !== 'newCamCard';
  }

  /** translation key for the modal header */
  get headerTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'camfil.account.cam_card.add_to_cam_card.button.add_to_cam_card.label'
      : 'camfil.account.cam_card.table.options.move_to_cam_card';
  }

  /** translation key for the submit button */
  get submitButtonTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'camfil.account.cam_card.add_to_cam_card.button.add_to_cam_card.label'
      : 'camfil.account.cam_card.table.options.move_to_cam_card';
  }

  /** translation key for the success text */
  get successTranslationKey() {
    return this.addMoveProduct === 'add'
      ? 'camfil.account.cam_card.added.confirmation'
      : 'camfil.account.cam_card.move.added.text';
  }
}
