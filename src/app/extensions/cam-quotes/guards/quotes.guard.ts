import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuotesGuard implements CanActivate {
  constructor(private camfilConfigurationFacade: CamfilConfigurationFacade) {}

  canActivate(): Observable<boolean> {
    return this.camfilConfigurationFacade.isEnabled$('allowQuotes');
  }
}
