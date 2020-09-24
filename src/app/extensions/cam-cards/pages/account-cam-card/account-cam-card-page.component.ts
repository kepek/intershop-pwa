import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard } from '../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-page',
  templateUrl: './account-cam-card-page.component.html',
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

  constructor(private camCardsFacade: CamCardsFacade) {}

  ngOnInit() {
    this.camCard$ = this.camCardsFacade.camCard$;
    this.camCardLoading$ = this.camCardsFacade.camCardLoading$;
    this.camCardError$ = this.camCardsFacade.camCardError$;
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
