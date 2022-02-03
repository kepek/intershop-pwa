import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { AuthorizationToggleService } from 'ish-core/utils/authorization-toggle/authorization-toggle.service';

@Directive({
  selector: '[ishIsNotAuthorizedTo]',
})
export class NotAuthorizationToggleDirective implements OnDestroy {
  private subscription: Subscription;
  private disabled$ = new ReplaySubject<boolean>(1);

  private destroy$ = new Subject();

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authorizationToggle: AuthorizationToggleService
  ) {
    this.disabled$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(disabled => {
      if (disabled) {
        this.viewContainer.clear();
      } else {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }

  @Input() set ishIsNotAuthorizedTo(permission: string) {
    // end previous subscription and subscribe to new permission
    if (this.subscription) {
      // tslint:disable-next-line: ban
      this.subscription.unsubscribe();
    }
    this.subscription = this.authorizationToggle
      .isAuthorizedTo(permission)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: val => this.disabled$.next(!val) });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
