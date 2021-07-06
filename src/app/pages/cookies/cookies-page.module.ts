import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilCookiesModalComponent } from './camfil-cookies-modal/camfil-cookies-modal.component';
import { CookiesModalComponent } from './cookies-modal/cookies-modal.component';
import { CookiesPageGuard } from './cookies-page.guard';

const cookiesPageRoutes: Routes = [
  {
    path: '',
    children: [],
    canActivate: [CookiesPageGuard],
    data: {
      meta: {
        title: 'cookie.preferences.heading',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [CommonModule, MatButtonModule, RouterModule.forChild(cookiesPageRoutes), SharedModule, TranslateModule],
  providers: [CookiesPageGuard],
  declarations: [CamfilCookiesModalComponent, CookiesModalComponent],
})
export class CookiesPageModule {}
