import {
  ChangeDetectionStrategy,
  Compiler,
  Component,
  ComponentRef,
  Injector,
  Input,
  NgModuleFactory,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { Basket } from 'ish-core/models/basket/basket.model';

@Component({
  selector: 'camfil-lazy-checkout-receipt-requisition',
  templateUrl: './lazy-camfil-checkout-receipt-requisition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyCamfilCheckoutReceiptRequisitionComponent implements OnInit, OnChanges {
  /*
   * WARNING!
   *
   * This file was automatically generated!
   * It should be updated using:
   *
   * ng g lazy-component extensions/cam-requisition-management/components/camfil-checkout-receipt-requisition/camfil-checkout-receipt-requisition.component.ts
   *
   */

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;
  @Input() basket: Basket;

  // tslint:disable-next-line: no-any
  private component: ComponentRef<any>;

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

      const { CamfilCheckoutReceiptRequisitionComponent } = await import(
        '../../components/camfil-checkout-receipt-requisition/camfil-checkout-receipt-requisition.component'
      );

      const moduleFactory = await this.loadModuleFactory(module);
      const moduleRef = moduleFactory.create(this.injector);
      const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(
        CamfilCheckoutReceiptRequisitionComponent
      );

      this.component = this.anchor.createComponent(factory);
      this.ngOnChanges();
      this.component.changeDetectorRef.markForCheck();
    }
  }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.basket = this.basket;
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
