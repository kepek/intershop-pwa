import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { BasketCreateCamCardComponent } from './shared/basket-create-cam-card/basket-create-cam-card.component';
import { CamCardPreferencesDialogComponent } from './shared/cam-card-preferences-dialog/cam-card-preferences-dialog.component';
import { ProductAddToCamCardComponent } from './shared/product-add-to-cam-card/product-add-to-cam-card.component';
import { SelectCamCardModalComponent } from './shared/select-cam-card-modal/select-cam-card-modal.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    BasketCreateCamCardComponent,
    CamCardPreferencesDialogComponent,
    ProductAddToCamCardComponent,
    SelectCamCardModalComponent,
  ],
  exports: [CamCardPreferencesDialogComponent, SelectCamCardModalComponent],
})
export class CamCardsModule {}
