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
  selector: 'ish-lazy-punchout-transfer-basket',
  templateUrl: './lazy-punchout-transfer-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyPunchoutTransferBasketComponent implements OnInit {
  /*
   * WARNING!
   *
   * This file was automatically generated!
   * It should be updated using:
   *
   * ng g lazy-component extensions/punchout/shared/punchout-transfer-basket/punchout-transfer-basket.component.ts
   *
   */

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;

  constructor(
    private featureToggleService: FeatureToggleService,
    private compiler: Compiler,
    private injector: Injector
  ) {}

  async ngOnInit() {
    if (this.featureToggleService.enabled('punchout')) {
      // prevent cyclic dependency warnings
      const extension = 'punchout';
      const moduleObj = await import(`../../${extension}.module`);
      const module = moduleObj[Object.keys(moduleObj)[0]];

      const { PunchoutTransferBasketComponent } = await import(
        '../../shared/punchout-transfer-basket/punchout-transfer-basket.component'
      );

      const moduleFactory = await this.loadModuleFactory(module);
      const moduleRef = moduleFactory.create(this.injector);
      const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(PunchoutTransferBasketComponent);

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
