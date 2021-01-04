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
import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-lazy-tacton-configure-product',
  templateUrl: './lazy-tacton-configure-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyTactonConfigureProductComponent implements OnInit, OnChanges {
  /*
   * WARNING!
   *
   * This file was automatically generated!
   * It should be updated using:
   *
   * ng g lazy-component extensions/tacton/shared/tacton-configure-product/tacton-configure-product.component.ts
   *
   */

  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;
  @Input() product: ProductView;
  @Input() displayType?: 'icon' | 'link' | 'list-button' = 'link';

  // tslint:disable-next-line: no-any
  private component: ComponentRef<any>;

  constructor(
    private featureToggleService: FeatureToggleService,
    private compiler: Compiler,
    private injector: Injector
  ) {}

  async ngOnInit() {
    if (this.featureToggleService.enabled('tacton')) {
      // prevent cyclic dependency warnings
      const extension = 'tacton';
      const moduleObj = await import(`../../${extension}.module`);
      const module = moduleObj[Object.keys(moduleObj)[0]];

      const { TactonConfigureProductComponent } = await import(
        '../../shared/tacton-configure-product/tacton-configure-product.component'
      );

      const moduleFactory = await this.loadModuleFactory(module);
      const moduleRef = moduleFactory.create(this.injector);
      const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(TactonConfigureProductComponent);

      this.component = this.anchor.createComponent(factory);
      this.ngOnChanges();
      this.component.changeDetectorRef.markForCheck();
    }
  }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.product = this.product;
      this.component.instance.displayType = this.displayType;
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
