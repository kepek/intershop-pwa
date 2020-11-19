import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-detail-sub-title',
  templateUrl: './account-cam-card-detail-sub-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardDetailSubTitleComponent {
  constructor(private camCardsFacade: CamCardsFacade) {}

  @Input() sub: CamCard;

  active = false;

  handleEdit(event) {
    event.stopPropagation();
    this.active = !this.active;
  }

  onBlurSubmit(event) {
    this.camCardsFacade.updateSubCamCard({ ...this.sub, name: event.target.value });
    this.active = false;
  }
}
