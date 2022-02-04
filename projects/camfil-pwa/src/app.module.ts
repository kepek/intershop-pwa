import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'ish-core/core.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';
import { FormsSharedModule } from 'ish-shared/forms/forms.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    FormsSharedModule,
    NoopAnimationsModule,
    RouterModule.forRoot([
      {
        path: 'camfil-pwa',
        loadChildren: () => import('./app/camfil-pwa.module').then(m => m.CamfilPwaModule),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      },
      {
        path: '**',
        redirectTo: 'camfil-pwa',
        pathMatch: 'full',
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
