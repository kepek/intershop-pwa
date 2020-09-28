import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountCamCardDetailLineItemComponent } from './pages/account-cam-card-detail/account-cam-card-detail-line-item/account-cam-card-detail-line-item.component';
import { BasketCreateCamCardComponent } from './shared/basket-create-cam-card/basket-create-cam-card.component';
import { CamCardPreferencesDialogComponent } from './shared/cam-card-preferences-dialog/cam-card-preferences-dialog.component';
import { ProductAddToCamCardComponent } from './shared/product-add-to-cam-card/product-add-to-cam-card.component';
import { SelectCamCardModalComponent } from './shared/select-cam-card-modal/select-cam-card-modal.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    AccountCamCardDetailLineItemComponent,
    BasketCreateCamCardComponent,
    CamCardPreferencesDialogComponent,
    ProductAddToCamCardComponent,
    SelectCamCardModalComponent,
  ],
  exports: [AccountCamCardDetailLineItemComponent, CamCardPreferencesDialogComponent, SelectCamCardModalComponent],
})
export class CamCardsModule {}
