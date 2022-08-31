import { Injectable } from '@angular/core';

@Injectable()
export class RequisitionManagementEffects {
  // TODO (extMlk): Disable requisition breadcrumb service due to errors in the runtime. Refactor/Override in Extension;
  // constructor(private requisitionManagementBreadcrumbService: RequisitionManagementBreadcrumbService) {}
  // setRequisitionManagementBreadcrumb$ = createEffect(() =>
  //   this.requisitionManagementBreadcrumbService
  //     .breadcrumb$('/account/requisitions')
  //     .pipe(map(breadcrumbData => setBreadcrumbData({ breadcrumbData })))
  // );
}
