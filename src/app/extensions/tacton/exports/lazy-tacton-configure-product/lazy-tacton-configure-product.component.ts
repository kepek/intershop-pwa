import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { TactonConfigureProductComponent } from '../../shared/tacton-configure-product/tacton-configure-product.component';

@Component({
  selector: 'camfil-lazy-tacton-configure-product',
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

  private component: ComponentRef<TactonConfigureProductComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit() {
    if (this.featureToggleService.enabled('tacton')) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(TactonConfigureProductComponent);
      this.component = this.anchor.createComponent(factory);
      this.ngOnChanges();
    }
  }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.product = this.product;
      this.component.instance.displayType = this.displayType;
    }
  }
}
