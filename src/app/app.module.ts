import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from 'ish-core/core.module';

import { AppComponent } from './app.component';
import { CamfilOrderTemplatesRoutingModule } from './extensions/camfil-order-templates/pages/camfil-order-templates-routing.module';
import { QuickorderRoutingModule } from './extensions/quickorder/pages/quickorder-routing.module';
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
    AppRoutingModule,
    QuickorderRoutingModule,
    CamfilOrderTemplatesRoutingModule,
    AppLastRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
