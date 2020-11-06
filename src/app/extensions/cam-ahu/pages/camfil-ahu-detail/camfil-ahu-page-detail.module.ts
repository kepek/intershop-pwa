import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAhuFiltersComponent } from './camfil-ahu-filters/camfil-ahu-filters.component';
import { CamfilAHUPageDetailComponent } from './camfil-ahu-page-detail.component';
import { CamfilAhuSlotsComponent } from './camfil-ahu-slots/camfil-ahu-slots.component';

const camfilAHUPageRoutes: Routes = [{ path: '', component: CamfilAHUPageDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(camfilAHUPageRoutes), SharedModule],
  declarations: [CamfilAHUPageDetailComponent, CamfilAhuFiltersComponent, CamfilAhuSlotsComponent],
})
export class CamfilAHUPageDetailModule {}
