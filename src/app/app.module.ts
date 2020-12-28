import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

import { COOKIE_CONSENT_VERSION } from 'ish-core/configurations/state-keys';
import { CoreModule } from 'ish-core/core.module';
import { SharedModule } from 'ish-shared/shared.module';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { CamAccountRoutingModule } from './extensions/cam-account/pages/cam-account-routing.module';
import { CamAhuRoutingModule } from './extensions/cam-ahu/pages/cam-ahu-routing.module';
import { CamConfigurationRoutingModule } from './extensions/cam-configuration/pages/cam-configuration-routing.module';
import { CamDemoRoutingModule } from './extensions/cam-demo/pages/cam-demo-routing.module';
import { CamIccRoutingModule } from './extensions/cam-icc/pages/cam-icc-routing.module';
import { QuickorderRoutingModule } from './extensions/quickorder/pages/quickorder-routing.module';
import { QuotingRoutingModule } from './extensions/quoting/pages/quoting-routing.module';
import { TactonRoutingModule } from './extensions/tacton/pages/tacton-routing.module';
import { AppLastRoutingModule } from './pages/app-last-routing.module';
import { AppRoutingModule } from './pages/app-routing.module';
import { ShellModule } from './shell/shell.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'intershop-pwa' }),
    BrowserAnimationsModule,
    CoreModule,
    ShellModule,
    SharedModule,
    CamAccountRoutingModule,
    AppRoutingModule,
    QuickorderRoutingModule,
    TactonRoutingModule,
    QuotingRoutingModule,
    CamDemoRoutingModule,
    CamAhuRoutingModule,
    CamIccRoutingModule,
    CamConfigurationRoutingModule,
    AppLastRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(transferState: TransferState) {
    if (!transferState.hasKey<number>(COOKIE_CONSENT_VERSION)) {
      transferState.set(COOKIE_CONSENT_VERSION, environment.cookieConsentVersion);
    }
  }
}
