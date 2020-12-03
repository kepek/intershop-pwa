import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'camfil-user-personal-form',
  templateUrl: './camfil-user-personal-form.component.html',
  styleUrls: ['./camfil-user-personal-form.component.scss'],
})
export class CamfilUserPersonalFormComponent implements OnInit {
  @Input() form: FormGroup;
  constructor() {}

  ngOnInit(): void {}
}
