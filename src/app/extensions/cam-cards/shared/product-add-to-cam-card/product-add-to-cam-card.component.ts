import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { SelectCamCardModalComponent } from '../select-cam-card-modal/select-cam-card-modal.component';

@Component({
  selector: 'ish-product-add-to-cam-card',
  templateUrl: './product-add-to-cam-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Product Add To Cam Card Component adds a product to a cam_cards.
 *
 * @example
 * <ish-product-add-to-cam-card
 *               [product]=product
 *               displayType="icon"
 * ></ish-product-add-to-cam-card>
 */
@GenerateLazyComponent()
export class ProductAddToCamCardComponent implements OnDestroy {
  @Input() product: Product;
  @Input() quantity: number;
  @Input() displayType?: 'icon' | 'link' | 'animated' = 'link';
  @Input() class?: string;
  private destroy$ = new Subject();

  constructor(private camCardsFacade: CamCardsFacade, private accountFacade: AccountFacade, private router: Router) {}

  /**
   * if the user is not logged in display login dialog, else open select cam cards dialog
   */
  openModal(modal: SelectCamCardModalComponent) {
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

  addProductToCamCard(camCard: { id: string; title: string }) {
    if (!camCard.id) {
      this.camCardsFacade.addProductToNewCamCard(camCard.title, this.product.sku, this.quantity);
    } else {
      this.camCardsFacade.addProductToCamCard(camCard.id, this.product.sku, this.quantity);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
