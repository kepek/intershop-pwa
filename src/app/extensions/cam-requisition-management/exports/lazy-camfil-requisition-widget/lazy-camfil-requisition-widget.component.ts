import {
  ChangeDetectionStrategy,
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';

@Component({
  selector: 'camfil-lazy-requisition-widget',
  templateUrl: './lazy-camfil-requisition-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyCamfilRequisitionWidgetComponent implements OnInit {
  /*
   * WARNING!
   *
   * This file was automatically generated!
   * It should be updated using:
   *
   * ng g lazy-component extensions/cam-requisition-management/components/camfil-requisition-widget/camfil-requisition-widget.component.ts
   *
   */

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  constructor(
    private featureToggleService: FeatureToggleService,
    private compiler: Compiler,
    private injector: Injector
  ) {}

  async ngOnInit() {
    if (this.featureToggleService.enabled('camRequisitionManagement')) {
      // prevent cyclic dependency warnings
      const extension = 'cam-requisition-management';
      const moduleObj = await import(`../../${extension}.module`);
      const module = moduleObj[Object.keys(moduleObj)[0]];

      const { CamfilRequisitionWidgetComponent } = await import(
        '../../components/camfil-requisition-widget/camfil-requisition-widget.component'
      );

      const moduleFactory = await this.loadModuleFactory(module);
      const moduleRef = moduleFactory.create(this.injector);
      const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(CamfilRequisitionWidgetComponent);

      this.anchor.createComponent(factory).changeDetectorRef.markForCheck();
    }
  }

  private async loadModuleFactory(t) {
    if (t instanceof NgModuleFactory) {
      return t;
    } else {
      return await this.compiler.compileModuleAsync(t);
    }
  }
}
