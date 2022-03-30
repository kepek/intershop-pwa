import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountCamCardDetailLineItemComponent } from './pages/account-cam-card-detail/account-cam-card-detail-line-item/account-cam-card-detail-line-item.component';
import { AddProductToCamCardModalComponent } from './shared/add-product-to-cam-card-modal/add-product-to-cam-card-modal.component';
import { CreateProductCamCardModalComponent } from './shared/add-product-to-cam-card-modal/create-product-cam-card-modal/create-product-cam-card-modal.component';
import { AddProductsToCamCardModalComponent } from './shared/add-products-to-cam-card-modal/add-products-to-cam-card-modal.component';
import { CreateProductsCamCardModalComponent } from './shared/add-products-to-cam-card-modal/create-products-cam-card-modal/create-products-cam-card-modal.component';
import { BasketCreateCamCardComponent } from './shared/basket-create-cam-card/basket-create-cam-card.component';
import { CamCardPreferencesDialogComponent } from './shared/cam-card-preferences-dialog/cam-card-preferences-dialog.component';
import { CamCardPreferencesComponent } from './shared/cam-card-preferences/cam-card-preferences.component';
import { CamCardProductCommentComponent } from './shared/cam-card-product-comment/cam-card-product-comment.component';
import { ProductAddingErrorDialogComponent } from './shared/cam-card-product-error-dialog/cam-card-product-error-dialog.component';
import { CamStepQuantityErrorDialogComponent } from './shared/cam-step-quantity-error-dialog/cam-step-quantity-error-dialog.component';
import { DndDirective } from './shared/import-cam-card-dialog/dnd.directive';
import { ImportCamCardDialogComponent } from './shared/import-cam-card-dialog/import-cam-card-dialog.component';
import { MoveCamCardDialogComponent } from './shared/move-cam-card-dialog/move-cam-card-dialog.component';
import { ProductAddToCamCardComponent } from './shared/product-add-to-cam-card/product-add-to-cam-card.component';
import { ProductsAddToCamCardComponent } from './shared/products-add-to-cam-card/products-add-to-cam-card.component';
import { UserAccessCamCardDialogComponent } from './shared/user-access-cam-card-dialog/user-access-cam-card-dialog.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    AccountCamCardDetailLineItemComponent,
    AddProductToCamCardModalComponent,
    AddProductsToCamCardModalComponent,
    BasketCreateCamCardComponent,
    CamCardPreferencesComponent,
    CamCardPreferencesDialogComponent,
    CamCardProductCommentComponent,
    CamStepQuantityErrorDialogComponent,
    CreateProductCamCardModalComponent,
    CreateProductsCamCardModalComponent,
    DndDirective,
    ImportCamCardDialogComponent,
    MoveCamCardDialogComponent,
    ProductAddToCamCardComponent,
    ProductAddingErrorDialogComponent,
    ProductsAddToCamCardComponent,
    UserAccessCamCardDialogComponent,
  ],
  exports: [
    AccountCamCardDetailLineItemComponent,
    AddProductToCamCardModalComponent,
    AddProductsToCamCardModalComponent,
    CamCardPreferencesComponent,
    CamCardPreferencesDialogComponent,
    CamCardProductCommentComponent,
    ImportCamCardDialogComponent,
    MoveCamCardDialogComponent,
    ProductAddToCamCardComponent,
    ProductAddingErrorDialogComponent,
    ProductsAddToCamCardComponent,
  ],
})
export class CamCardsModule {}
