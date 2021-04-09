import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { first, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard } from '../../models/cam-card/cam-card.model';
import { SelectCamCardModalComponent } from '../select-cam-card-modal/select-cam-card-modal.component';

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
  private destroy$ = new Subject();

  camCards$: Observable<CamCard[]>;

  @ViewChild(CamfilSmallCtaModalComponent) errorModal: CamfilSmallCtaModalComponent;

  constructor(
    private camCardsFacade: CamCardsFacade,
    private accountFacade: AccountFacade,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.camCardsFacade.camCardsLoading$.pipe(take(1)).subscribe(loading => {
      if (!loading) {
        this.camCardsFacade.camCard$
          .pipe(first())
          .subscribe(camCards => (!camCards?.length ? this.camCardsFacade.loadCamCards() : ''));
      }
    });
  }

  /**
   * if the user is not logged in display login dialog, else open select cam cards dialog
   */
  openModal(modal: SelectCamCardModalComponent) {
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

  openAddModal(modal: SelectCamCardModalComponent) {
    modal.quantity = this.quantity;
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }

  openErrorModal() {
    this.dialog.open(this.errorModal?.show());
    this.errorModal.hide = () => this.dialog.closeAll();
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
