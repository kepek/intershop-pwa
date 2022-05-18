import { Component, HostBinding, Input, forwardRef } from '@angular/core';
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
export class SearchInputComponent implements ControlValueAccessor {
  @HostBinding('class') get hostClass() {
    return this.hasFocus ? 'mat-elevation-z4' : 'mat-elevation-z2';
  }

  @Input() placeholder: string;

  hasFocus: boolean;
  searchText: string;

  protected onChanged: Function;
  protected onTouched: Function;

  registerOnChange(fn: Function): void {
    this.onChanged = fn;
  }
  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  writeValue(obj: string): void {
    this.searchText = obj;
  }
}
