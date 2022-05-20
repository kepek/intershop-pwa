import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAccountQuotesPageComponent } from './camfil-account-quotes-page.component';

const routes: Routes = [
  {
    path: '',
    component: CamfilAccountQuotesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [CamfilAccountQuotesPageComponent],
})
export class CamfilAccountQuotesPageModule {}
