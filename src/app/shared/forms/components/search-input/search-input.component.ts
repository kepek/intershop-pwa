import { Component, HostBinding, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'camfil-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SearchInputComponent),
    },
  ],
})
export class SearchInputComponent implements OnInit, ControlValueAccessor {
  @HostBinding('class') get hostClass() {
    return this.hasFocus ? 'mat-elevation-z4' : 'mat-elevation-z2';
  }

  searchText: string;
  @Input() placeholder: string;
  hasFocus: boolean;

  onChange = (_: any) => { };
  onTouch = () => { };

  constructor() { }

  ngOnInit(): void {
    console.log('asd');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(obj: any): void {
    this.searchText = obj;
  }
}
