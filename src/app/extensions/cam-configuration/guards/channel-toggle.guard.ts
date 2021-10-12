import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

import { ConfigurationService } from '../services/configuration/configuration.service';

@Injectable({ providedIn: 'root' })
export class ChannelToggleGuard implements CanActivate {
  constructor(
    private configurationService: ConfigurationService,
    private router: Router,
    private httpStatusCodeService: HttpStatusCodeService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): boolean | UrlTree {
    if (!this.configurationService.isEnabled(route.data.channelSetting)) {
      this.httpStatusCodeService.setStatus(404);
      return this.router.parseUrl('/error');
    }
    return true;
  }
}
