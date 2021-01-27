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

@Component({
  selector: 'ish-lazy-content-include',
  templateUrl: './lazy-content-include.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyContentIncludeComponent implements OnInit, OnChanges {
  @ViewChild('anchor', { read: ViewContainerRef, static: true }) anchor: ViewContainerRef;
  /**
   * The ID of the Include whoes content is to be rendered (lazy loaded).
   */
  @Input() includeId: string;

  // tslint:disable-next-line: no-any
  private component: ComponentRef<any>;

  constructor(private compiler: Compiler, private injector: Injector) {}

  async ngOnInit() {
    // prevent cyclic dependency warnings
    const moduleObj = await import('../../../shared/shared.module');
    const module = moduleObj[Object.keys(moduleObj)[0]];

    const { ContentIncludeComponent } = await import(
      '../../../shared/cms/components/content-include/content-include.component'
    );

    const moduleFactory = await this.loadModuleFactory(module);
    const moduleRef = moduleFactory.create(this.injector);
    const factory = moduleRef.componentFactoryResolver.resolveComponentFactory(ContentIncludeComponent);

    this.component = this.anchor.createComponent(factory);
    this.ngOnChanges();
    this.component.changeDetectorRef.markForCheck();
  }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.includeId = this.includeId;
      this.component.instance.ngOnChanges();
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
