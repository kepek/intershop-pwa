import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { CamfilChannelSetting } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

/**
 * Structural directive.
 * Used on an element, this element will only be rendered if the specified channel setting *is enabled*.
 *
 * @example
 * <div *camfilChannelToggle="'FR'">
 *   Only visible when viewing France channel.
 * </div>
 */
@Directive({
  selector: '[camfilChannelToggle]',
})
export class CamfilChannelToggleDirective implements OnDestroy {
  private subscription: Subscription;
  private enabled$ = new ReplaySubject<boolean>(1);
  private destroy$ = new Subject();

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private camfilConfigurationFacade: CamfilConfigurationFacade
  ) {
    this.enabled$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(enabled => {
      if (enabled) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }

  @Input() set camfilChannelToggle(channelSetting: CamfilChannelSetting) {
    // end previous subscription and subscribe to new permission
    if (this.subscription) {
      // tslint:disable-next-line: ban
      this.subscription.unsubscribe();
    }
    this.subscription = this.camfilConfigurationFacade
      .isEnabled$(channelSetting)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: val => this.enabled$.next(val) });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
