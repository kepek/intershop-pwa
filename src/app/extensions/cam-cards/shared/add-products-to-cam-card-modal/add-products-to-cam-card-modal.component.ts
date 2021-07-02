import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ProductItem } from 'ish-core/models/product/product-item';

import { CamCardItemComment, CreateCamCardData } from '../../models/cam-card/cam-card.model';
import { AddProductToCamCardModalComponent } from '../add-product-to-cam-card-modal/add-product-to-cam-card-modal.component';

/**
 * The cam cards select modal displays a list of cam_cards. The user can select one cam cards  or enter a name for a new cam card in order to add or move an item to the selected cam cards .
 */
@Component({
  selector: 'camfil-add-products-to-cam-card-modal',
  templateUrl: './add-products-to-cam-card-modal.component.html',
  styleUrls: ['./add-products-to-cam-card-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class AddProductsToCamCardModalComponent extends AddProductToCamCardModalComponent implements OnInit, OnChanges {
  private itemsValues: (ProductItem & { quantityForm: FormGroup })[] = [];

  @Input() products: ProductItem[];

  @Input() set items(items: (ProductItem & { quantityForm: FormGroup })[]) {
    this.itemsValues = items;
  }

  get items() {
    return this.itemsValues;
  }

  private createItems() {
    this.items = this.products.map(item => {
      const quantityForm = new FormGroup({
        quantity: new FormControl(item?.quantity || item?.product?.minOrderQuantity || 0),
        boxLabel: new FormControl('', Validators.maxLength(60)),
      });

      return {
        ...item,
        quantityForm,
      };
    });
  }

  init() {
    this.createItems();

    super.init();
  }

  ngOnChanges() {
    this.createItems();
  }

  addToCamcard() {
    this.items.forEach(item => {
      const quantity = item.quantityForm.get('quantity').value;
      const boxLabel = item.quantityForm.get('boxLabel').value;

      if (!this.disableIfNoMeasurements()) {
        if (this.camCardSelected && this.isAddedToNewSubCamCard()) {
          this.addToNewSubCamCard(item.product, quantity, boxLabel);
          return;
        }
        if (this.camCardSelected) {
          if (this.isAddedToExistingSubCamCard()) {
            const rootCamCard = this.camCards.find(camCard => camCard.id === this.camCardSelected);

            this.camCardsFacade.addProductToSubCamCard(
              this.segmentSelected,
              this.camCardSelected,
              item.product.sku,
              quantity,
              boxLabel
            );
            this.currentSubCamCardName = rootCamCard.subCamCards.find(sub => sub.id === this.segmentSelected).name;
            this.useSubCamCard = true;
          } else {
            const comment: CamCardItemComment = { label: boxLabel };

            this.camCardsFacade.addProductToCamCard(this.camCardSelected, item.product.sku, quantity, comment);
            this.useSubCamCard = false;
          }
        }
      }
    });
    this.resetFormValues();
  }

  createCamCardAndAdd({ camCard, edit, subCamCard, measurement }: CreateCamCardData) {
    if (subCamCard) {
      this.items.forEach(item => {
        const quantity = item.quantityForm.get('quantity').value;
        const boxLabel = item.quantityForm.get('boxLabel').value;

        this.camCardsFacade.addToNewCamCardWithNewSubCamCard(
          camCard,
          subCamCard,
          item.product.sku,
          quantity,
          boxLabel,
          measurement,
          edit
        );
      });
    } else {
      this.items.forEach(item => {
        const quantity = item.quantityForm.get('quantity').value;
        const boxLabel = item.quantityForm.get('boxLabel').value;

        this.camCardsFacade.addProductToNewCamCardAndEdit(
          camCard,
          item.product.sku,
          quantity,
          boxLabel,
          measurement,
          edit
        );
      });
    }
    this.resetFormValues();
    this.dialog.closeAll();
    this.hide();
  }

  show() {
    this.items.forEach(({ quantity, quantityForm }) => {
      quantityForm?.controls.quantity.setValue(quantity);
      quantityForm?.controls.boxLabel.setValue('');
    });

    this.camCardsFacade.unSelectCamCard();
    this.showForm = true;

    return this.modalTemplate;
  }

  resetFormValues() {
    this.resetQuantityValue.emit();
  }
}
