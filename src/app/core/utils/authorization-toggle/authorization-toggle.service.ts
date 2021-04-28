import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { getUserPermissions } from 'ish-core/store/customer/authorization';
import { whenTruthy } from 'ish-core/utils/operators';

export function checkPermission(permissions: string[], permission: string): boolean {
  if (permission === 'always') {
    return true;
  } else if (permission === 'never') {
    return false;
  } else {
    return permissions.includes(permission);
  }
}

export function checkPermissionList(permissions: string[], permissionList: string[]): boolean {
  if (permissionList.includes('always')) {
    return true;
  } else if (permissionList.includes('never')) {
    return false;
  } else {
    for (const permission of permissionList) {
      if (permissions.includes(permission)) {
        return true;
      }
    }
  }
}

@Injectable({ providedIn: 'root' })
export class AuthorizationToggleService {
  private permissions$: Observable<string[]>;

  constructor(store: Store) {
    this.permissions$ = store.pipe(select(getUserPermissions));
  }

  isAuthorizedTo(permission: string): Observable<boolean> {
    // special case shortcut
    if (permission === 'always' || permission === 'never') {
      return of(checkPermission([], permission));
    }
    return this.permissions$.pipe(
      // wait for permissions to be loaded
      whenTruthy(),
      map(permissions => checkPermission(permissions, permission))
    );
  }

  /**
   *
   * @param permissions
   * @returns true, if all of the provided permissions are matching
   */
  isAuthorizedToCheckArrAll(permissions: string[]): Observable<boolean> {
    // special case shortcut
    if (permissions.includes('always') || permissions.includes('never')) {
      return of(
        checkPermission(
          [],
          permissions.find(p => p === 'always' || p === 'never')
        )
      );
    }
    return this.permissions$.pipe(
      // wait for permissions to be loaded
      whenTruthy(),
      map(allPermissions => permissions.filter(p => checkPermission(allPermissions, p)).length === permissions.length)
    );
  }
  /**
   *
   * @param permissions
   * @returns true, if any of the provided permissions are matching
   */
  isAuthorizedToCheckArrAny(permissions: string[]): Observable<boolean> {
    // special case shortcut
    if (permissions.includes('always') || permissions.includes('never')) {
      return of(
        checkPermission(
          [],
          permissions.find(p => p === 'always' || p === 'never')
        )
      );
    }
    return this.permissions$.pipe(
      // wait for permissions to be loaded
      whenTruthy(),
      map(allPermissions => permissions.filter(p => checkPermission(allPermissions, p)).length >= 1)
    );
  }
}
