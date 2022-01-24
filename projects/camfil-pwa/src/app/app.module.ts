import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CamfilPwaRoutingModule } from './pages/camfil-pwa-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CamfilPwaRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
