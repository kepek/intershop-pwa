import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard } from '../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-page',
  templateUrl: './account-cam-card-page.component.html',
  styleUrls: ['./account-cam-card-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardPageComponent implements OnInit {
  /**
   * The list of cam cards of the customer.
   */
  camCard$: Observable<CamCard[]>;
  /**
   * Indicator for loading state of cam cards
   */
  camCardLoading$: Observable<boolean>;
  /**
   * Error state in case of an error during creation of a new cam_cards.
   */
  camCardError$: Observable<HttpError>;

  deviceType$: Observable<DeviceType>;

  private destroy$ = new Subject();

  @ViewChild('processingDialog') processingDialog: CamfilModalDialogComponent<unknown>;

  constructor(
    private camCardsFacade: CamCardsFacade,
    private appFacade: AppFacade,
    private checkoutFacade: CheckoutFacade
  ) {}

  ngOnInit() {
    this.camCard$ = this.camCardsFacade.camCard$;
    this.camCardLoading$ = this.camCardsFacade.camCardsLoading$;
    this.camCardError$ = this.camCardsFacade.camCardError$;
    this.deviceType$ = this.appFacade.deviceType$;

    this.checkoutFacade.basketLoading$
      .pipe(
        withLatestFrom(this.checkoutFacade.basket$),
        filter(([, basket]) => !!basket?.id),
        map(([loading]) => loading),
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe(loading => {
        if (loading) {
          this.processingDialog?.show();
        } else {
          this.processingDialog.hide();
        }
      });
  }

  /** dispatch delete request */
  deleteCamCard(id: string) {
    this.camCardsFacade.deleteCamCard(id);
  }

  /** dispatch creation request */
  addCamCard(camCard: CamCard) {
    this.camCardsFacade.addCamCard(camCard);
  }
}
