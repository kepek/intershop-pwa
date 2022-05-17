import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { QuoteLineItem } from '../../../../models/quote-details/quote-details.model';

@Component({
  selector: 'camfil-quote-line-item',
  templateUrl: './quote-line-item.component.html',
  styleUrls: ['./quote-line-item.component.scss'],
})
export class QuoteLineItemComponent implements OnInit, OnChanges {
  @Input() item: QuoteLineItem;
  quantityForm: FormGroup;
  @Output() selected: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleted: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    this.quantityForm = new FormGroup({
      quantity: new FormControl(),
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.quantityForm.setValue({ quantity: this.item.quantity.value });
    }
  }

  onChangeSelection(selected: MatCheckboxChange) {
    this.selected.next(selected.checked);
  }

  delete() {
    this.deleted.next();
  }
}
