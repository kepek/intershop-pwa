import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface Customer {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'camfil-cam-cards-search',
  templateUrl: './camfil-cam-cards-search.component.html',
  styleUrls: ['./camfil-cam-cards-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCamCardsSearchComponent implements OnInit {
  @Input() count: number;
  @Output() queryChanged = new EventEmitter<string>();

  searchInput: string;
  selectInput: string;
  customers: Customer[];

  ngOnInit() {
    this.searchInput = '';
    this.selectInput = '';
    this.customers = [
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
  }

  submit(value) {
    this.queryChanged.emit(value);
  }
}
