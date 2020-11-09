import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AHUBanner, AHUManufacturer, AHUModel, IMAGE, MANUFACTURERS, MODELS } from './database';

@Component({
  selector: 'camfil-ahu-page',
  styleUrls: ['./camfil-ahu-page.component.scss'],
  templateUrl: './camfil-ahu-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAHUPageComponent implements OnInit {
  constructor(private router: Router) {}
  banner: AHUBanner = IMAGE;
  manufacturers: AHUManufacturer[] = MANUFACTURERS;
  models: AHUModel[] = MODELS;
  manufacturerSelect: number;
  modelSelect: number;

  ngOnInit() {
    this.manufacturerSelect = undefined;
    this.modelSelect = undefined;
  }

  selectUnit() {
    this.router.navigate(['/air-handling-unit-guide/detail']);
  }
}
