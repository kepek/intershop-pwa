import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'camfil-ie-modal',
  templateUrl: './camfil-ie-modal.component.html',
  styleUrls: ['./camfil-ie-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilIEModalComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
