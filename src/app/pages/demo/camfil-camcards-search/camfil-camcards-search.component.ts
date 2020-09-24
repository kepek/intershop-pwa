import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'camfil-camcards-search',
  templateUrl: './camfil-camcards-search.component.html',
  styleUrls: ['./camfil-camcards-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCamcardsSearchComponent {
  foods = [
    {
      value: 'test',
      viewValue: 'test',
    },
    { value: 'test2', viewValue: 'test2' },
  ];
  camcardSum = 5;
}
