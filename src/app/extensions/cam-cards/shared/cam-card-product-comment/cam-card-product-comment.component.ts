import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard, CamCardItem } from '../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-cam-card-product-comment',
  templateUrl: './cam-card-product-comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamCardProductCommentComponent implements OnInit, OnDestroy {
  @Input() currentCamCard?: CamCard;
  @Input() camCardItem: CamCardItem;
  @Input() mode: 'edit' | 'view';

  commentForm: FormGroup;
  inputs = [];

  private destroy$ = new Subject<void>();
  constructor(private fb: FormBuilder, private camCardsFacade: CamCardsFacade) {}

  ngOnInit() {
    if (this.mode === 'edit') {
      this.initForm();
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    this.commentForm = this.fb.group({
      label: [this.camCardItem?.comment?.label],
      text: [this.camCardItem?.comment?.text],
    });
    this.inputs = Object.keys(this.commentForm.value);
  }

  keyupEnter(target: HTMLDataElement) {
    target.blur();
  }

  onBlur(target: HTMLDataElement, type: string) {
    const oldValue = this.camCardItem.comment[type];
    const newValue = target.value;
    if (newValue && newValue !== oldValue) {
      const newItem = { ...this.camCardItem, comment: { ...this.commentForm.value } };
      this.camCardsFacade.updateCamCardProduct(this.currentCamCard.rootCamCard, this.currentCamCard.id, newItem);
    }
  }
}
