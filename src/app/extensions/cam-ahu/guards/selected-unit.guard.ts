import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, race, timer } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

import { CamAhuFacade } from '../facades/cam-ahu.facade';

@Injectable({
  providedIn: 'root',
})
export class SelectedUnitGuard implements CanActivate {
  constructor(
    private router: Router,
    private httpStatusCodeService: HttpStatusCodeService,
    private ahuFacade: CamAhuFacade
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return race(
      // try to wait for ahu unit to be loaded and return appropriate result if ok
      this.ahuFacade.selectedAhuUnitId$.pipe(map(unitId => !!unitId)),
      // timeout and forbid visiting page
      timer(4000).pipe(mapTo(false))
    ).pipe(
      map(enabled => {
        if (!enabled) {
          this.httpStatusCodeService.setStatus(404);
          return this.router.parseUrl('/error');
        }
        return true;
      })
    );
  }
}
