import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenFalsy } from 'ish-core/utils/operators';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { AddProductToCamCardModalComponent } from '../add-product-to-cam-card-modal/add-product-to-cam-card-modal.component';

@Component({
  selector: 'camfil-product-add-to-cam-card',
  templateUrl: './product-add-to-cam-card.component.html',
  styleUrls: ['./product-add-to-cam-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Product Add To Cam Card Component adds a product to a cam_cards.
 *
 * @example
 * <camfil-product-add-to-cam-card
 *               [product]=product
 *               displayType="icon"
 * ></camfil-product-add-to-cam-card>
 */
@GenerateLazyComponent()
export class ProductAddToCamCardComponent implements OnInit, OnDestroy {
  @Input() product: Product;
  @Input() quantity: number;
  @Input() displayType?: 'icon' | 'link' | 'animated' | 'round-btn' = 'link';
  @Input() class?: string;
  @Input() hasIcon = false;
  @Input() disabled = false;
  @Input() translationKey = 'camfil.account.cam_card.add_to_template.button.add_to_template.label';
  buttonTranslationKey = 'camfil.account.cam_card.add_to_template.button.add_to_template.label';

  private destroy$ = new Subject();

  @ViewChild(CamfilSmallCtaModalComponent) errorModal: CamfilSmallCtaModalComponent;

  constructor(
    private camCardsFacade: CamCardsFacade,
    private accountFacade: AccountFacade,
    private router: Router,
    public dialog: MatDialog
  ) {}

  protected init() {
    this.camCardsFacade.camCardsLoading$.pipe(whenFalsy(), take(1)).subscribe(() => {
      this.camCardsFacade.camCard$
        .pipe(first())
        .subscribe(camCards => (!camCards?.length ? this.camCardsFacade.loadCamCards() : ''));
    });

    this.accountFacade.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.buttonTranslationKey = 'camfil.product.add_to_camcard.not_logged.label';
      } else {
        this.buttonTranslationKey = this.translationKey;
      }
    });
  }

  ngOnInit() {
    this.init();
  }

  /**
   * if the user is not logged in display login dialog, else open select cam cards dialog
   */
  openModal(modal: AddProductToCamCardModalComponent) {
    this.accountFacade.isLoggedIn$.pipe(take(1), takeUntil(this.destroy$)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.quantity ? this.openAddModal(modal) : this.openErrorModal();
      } else {
        // stay on the same page after login
        const queryParams = { returnUrl: this.router.routerState.snapshot.url, messageKey: 'cam_cards' };
        this.router.navigate(['/login'], { queryParams });
      }
    });
  }

  openAddModal(modal: AddProductToCamCardModalComponent) {
    modal.quantity = this.quantity;
    this.dialog.open(modal.show(), { maxHeight: '100vh' });
    modal.hide = () => this.dialog.closeAll();
  }

  openErrorModal() {
    const refErrorModalDialog = this.dialog.open(this.errorModal?.show());
    this.errorModal.hide = () => {
      refErrorModalDialog.close();
    };
  }

  addProductToCamCard(camCard: { id: string; name: string }) {
    if (!camCard.id) {
      this.camCardsFacade.addProductToNewCamCard(camCard.name, this.product.sku, this.quantity);
    } else {
      this.camCardsFacade.addProductToCamCard(camCard.id, this.product.sku, this.quantity);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
