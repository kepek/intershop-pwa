import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'camfil-camcards-search',
  templateUrl: './camfil-camcards-search.component.html',
  styleUrls: ['./camfil-camcards-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCamcardsSearchComponent {
  @Input() count: Number;
  @Output() queryChanged = new EventEmitter<string>();

  searchInput$ = '';
  selectInput$ = '';

  customers = [
    {
      value: 'hydrogen',
      viewValue: 'Hydrogen',
    },
    {
      value: 'lithium',
      viewValue: 'Lithium',
    },
    {
      value: 'beryllium',
      viewValue: 'Beryllium',
    },
    {
      value: 'boron',
      viewValue: 'Boron',
    },
    {
      value: 'carbon',
      viewValue: 'Carbon',
    },
  ];

  submit(value) {
    this.queryChanged.emit(value);
  }
}
