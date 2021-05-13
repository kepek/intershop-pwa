import { ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CamAhuFacade } from '../../facades/cam-ahu.facade';
import { Manufacturer } from '../../models/manufacturer/manufacturer.model';
import { Unit } from '../../models/unit/unit.model';

import { AHUBanner, AHUManufacturer, AHUModel, IMAGE, MANUFACTURERS, MODELS } from './database';

@Component({
  selector: 'camfil-ahu-page',
  styleUrls: ['./camfil-ahu-page.component.scss'],
  templateUrl: './camfil-ahu-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAHUPageComponent implements OnInit, OnChanges {
  ahuManufacturers$: Observable<Manufacturer[]>;
  ahuUnits$: Observable<Unit[]>;
  ahuForm: FormGroup;
  constructor(private router: Router, private ahuFacade: CamAhuFacade, private fb: FormBuilder) {}
  banner: AHUBanner = IMAGE;
  manufacturers: AHUManufacturer[] = MANUFACTURERS;
  models: AHUModel[] = MODELS;
  manufacturerSelect: number;
  modelSelect: number;
  manufacturerId: number;
  unitId: number;

  ngOnInit() {
    this.manufacturerSelect = undefined;
    this.modelSelect = undefined;

    this.ahuManufacturers$ = this.ahuFacade.ahuManufacturers$;
    this.ahuUnits$ = this.ahuFacade.ahuUnits$;
    // AHU-Form
    this.ahuForm = this.fb.group({
      manufacturer: new FormControl(undefined, [Validators.required]),
      unit: new FormControl(undefined, [Validators.required]),
    });
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.unitId || c.manufacturerId) {
      this.submitAhuForm();
    }
  }

  selectAhuManufacturer(event) {
    this.manufacturerId = event.value;
    this.ahuFacade.selectAhuManufacturer$(this.manufacturerId);
  }

  // on changes check for 2 varaibles to be true

  selectAhuUnit(event) {
    this.unitId = event.value;
    if (this.unitId) {
      this.submitAhuForm();
    }
  }

  submitAhuForm() {
    const manufacturerId = this.manufacturerId;
    const unitId = this.unitId;

    if (this.manufacturerId && this.unitId) {
      this.router.navigate(['/air-handling-unit-guide/detail'], {
        queryParamsHandling: 'merge',

        queryParams: {
          manufacturerId,
          unitId,
        },
      });
    }
  }
}
