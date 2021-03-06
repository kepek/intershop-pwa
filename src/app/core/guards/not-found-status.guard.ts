import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

@Injectable({ providedIn: 'root' })
export class NotFoundStatusGuard implements CanActivate {
  constructor(private httpStatusCodeService: HttpStatusCodeService) {}

  canActivate(): boolean {
    this.httpStatusCodeService.setStatusAndRedirect(404);
    return false;
  }
}
