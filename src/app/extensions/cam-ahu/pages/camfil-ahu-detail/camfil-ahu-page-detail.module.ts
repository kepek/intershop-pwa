import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamCardsModule } from '../../../cam-cards/cam-cards.module';
import { CamAhuModule } from '../../cam-ahu.module';

import { CamfilAhuCartComponent } from './camfil-ahu-cart/camfil-ahu-cart.component';
import { CamfilAHUPageDetailComponent } from './camfil-ahu-page-detail.component';
import { CamfilAhuSlotsComponent } from './camfil-ahu-slots/camfil-ahu-slots.component';

const camfilAHUPageRoutes: Routes = [{ path: '', component: CamfilAHUPageDetailComponent }];

@NgModule({
  imports: [CamAhuModule, CamCardsModule, RouterModule.forChild(camfilAHUPageRoutes), SharedModule],
  declarations: [CamfilAHUPageDetailComponent, CamfilAhuCartComponent, CamfilAhuSlotsComponent],
})
export class CamfilAHUPageDetailModule {}
