import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

import { CamQuotesFacade } from '../facades/cam-quotes.facade';

@Injectable({ providedIn: 'root' })
export class QuotesGuard implements CanActivate {
  constructor(private camQuotesFacade: CamQuotesFacade) {}

  canActivate(): Observable<boolean> {
    return this.camQuotesFacade.isQuotesModuleEnabled$;
  }
}
