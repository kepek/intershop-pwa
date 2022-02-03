import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthorizationToggleDirective } from './directives/authorization-toggle.directive';
import { CamfilAuthorizationToggleDirective } from './directives/camfil-authorization-toggle.directive';
import { NotAuthorizationToggleDirective } from './directives/not-authorization-toggle.directive';
import {
  AuthorizationToggleService,
  checkPermission,
  checkPermissionList,
} from './utils/authorization-toggle/authorization-toggle.service';
import { whenTruthy } from './utils/operators';

@NgModule({
  declarations: [AuthorizationToggleDirective, CamfilAuthorizationToggleDirective, NotAuthorizationToggleDirective],
  exports: [AuthorizationToggleDirective, CamfilAuthorizationToggleDirective, NotAuthorizationToggleDirective],
})
export class AuthorizationToggleModule {
  private static permissions = new ReplaySubject<string[]>(1);

  static forTesting(...permissions: string[]): ModuleWithProviders<AuthorizationToggleModule> {
    AuthorizationToggleModule.switchTestingPermissions(...permissions);
    return {
      ngModule: AuthorizationToggleModule,
      providers: [
        {
          provide: AuthorizationToggleService,
          useValue: {
            isAuthorizedTo: (permission: string) =>
              AuthorizationToggleModule.permissions.pipe(
                whenTruthy(),
                map(perms => checkPermission(perms, permission))
              ),
            isAuthorizedToCheckArrAny: (permissionArray: string[]) =>
              AuthorizationToggleModule.permissions.pipe(
                whenTruthy(),
                map(perms => checkPermissionList(perms, permissionArray))
              ),
          },
        },
      ],
    };
  }

  static switchTestingPermissions(...permissions: string[]) {
    AuthorizationToggleModule.permissions.next(permissions);
  }
}

export { AuthorizationToggleService } from './utils/authorization-toggle/authorization-toggle.service';
export { AuthorizationToggleGuard } from './guards/authorization-toggle.guard';
