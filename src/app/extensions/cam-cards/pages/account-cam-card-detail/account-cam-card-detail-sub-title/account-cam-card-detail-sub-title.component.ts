import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-detail-sub-title',
  templateUrl: './account-cam-card-detail-sub-title.component.html',
  styleUrls: ['./account-cam-card-detail-sub-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardDetailSubTitleComponent {
  constructor(private camCardsFacade: CamCardsFacade) {}

  @Input() sub: CamCard;
  @Input() mainDeliveryInterval?: number;
  @Output() delete = new EventEmitter<Event>();

  active = false;

  handleEdit(event: Event) {
    event.stopPropagation();
    this.active = !this.active;
  }

  handleDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(event);
  }

  onBlurSubmit(event) {
    this.camCardsFacade.updateSubCamCard({ ...this.sub, name: event.target.value });
    this.onBlur();
  }

  onBlur() {
    this.active = false;
  }
}
