import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountCamCardDetailLineItemComponent } from './pages/account-cam-card-detail/account-cam-card-detail-line-item/account-cam-card-detail-line-item.component';
import { BasketCreateCamCardComponent } from './shared/basket-create-cam-card/basket-create-cam-card.component';
import { CamCardPreferencesDialogComponent } from './shared/cam-card-preferences-dialog/cam-card-preferences-dialog.component';
import { CamCardPreferencesComponent } from './shared/cam-card-preferences/cam-card-preferences.component';
import { CamCardProductCommentComponent } from './shared/cam-card-product-comment/cam-card-product-comment.component';
import { DndDirective } from './shared/import-cam-card-dialog/dnd.directive';
import { ImportCamCardDialogComponent } from './shared/import-cam-card-dialog/import-cam-card-dialog.component';
import { MoveCamCardDialogComponent } from './shared/move-cam-card-dialog/move-cam-card-dialog.component';
import { ProductAddToCamCardComponent } from './shared/product-add-to-cam-card/product-add-to-cam-card.component';
import { CreateCamCardModalComponent } from './shared/select-cam-card-modal/create-cam-card-modal/create-cam-card-modal.component';
import { SelectCamCardModalComponent } from './shared/select-cam-card-modal/select-cam-card-modal.component';
import { UserAccessCamCardDialogComponent } from './shared/user-access-cam-card-dialog/user-access-cam-card-dialog.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    AccountCamCardDetailLineItemComponent,
    BasketCreateCamCardComponent,
    CamCardPreferencesComponent,
    CamCardPreferencesDialogComponent,
    CamCardProductCommentComponent,
    CreateCamCardModalComponent,
    MoveCamCardDialogComponent,
    ImportCamCardDialogComponent,
    ProductAddToCamCardComponent,
    SelectCamCardModalComponent,
    UserAccessCamCardDialogComponent,
    DndDirective
  ],
  exports: [
    AccountCamCardDetailLineItemComponent,
    CamCardPreferencesComponent,
    CamCardPreferencesDialogComponent,
    CamCardProductCommentComponent,
    MoveCamCardDialogComponent,
    ImportCamCardDialogComponent,
    SelectCamCardModalComponent,
  ],
})
export class CamCardsModule {}
