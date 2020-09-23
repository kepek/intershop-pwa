import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard } from '../../models/cam-card/cam-card.model';
import { CamCardPreferencesDialogComponent } from '../cam-card-preferences-dialog/cam-card-preferences-dialog.component';

@Component({
  selector: 'ish-basket-create-cam-card',
  templateUrl: './basket-create-cam-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Basket Create Cam Card displays a button which adds the current cart to to a new cam_cards.
 */

@GenerateLazyComponent()
export class BasketCreateCamCardComponent implements OnDestroy {
  @Input() products: LineItemView[];
  @Input() class?: string;
  private destroy$ = new Subject();

  constructor(private camCardsFacade: CamCardsFacade, private accountFacade: AccountFacade, private router: Router) {}
  /**
   * if the user is not logged in display login dialog, else open select cam cards dialog
   */
  openModal(modal: CamCardPreferencesDialogComponent) {
    this.accountFacade.isLoggedIn$.pipe(take(1), takeUntil(this.destroy$)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        modal.show();
      } else {
        // stay on the same page after login
        const queryParams = { returnUrl: this.router.routerState.snapshot.url, messageKey: 'cam_cards' };
        this.router.navigate(['/login'], { queryParams });
      }
    });
  }

  createCamCard(camCard: CamCard) {
    this.camCardsFacade.addBasketToNewCamCard(camCard);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
