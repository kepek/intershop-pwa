import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatChipInputEvent } from '@angular/material/chips';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CamfilIcon, getCamfilIcons } from 'camfil-shared/icon/icon.module';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DemoBottomSheetComponent } from './demo-bottom-sheet/demo-bottom-sheet.component';
import { DemoDialogComponent } from './demo-dialog/demo-dialog.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface Fruit {
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

// tslint:disable-next-line:component-creation-test
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'camfil-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoPageComponent implements AfterViewInit, OnInit {
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private bottomSheet: MatBottomSheet) {
    // Update the value for the progress-bar on an interval.
    setInterval(() => {
      this.progress = (this.progress + Math.floor(Math.random() * 4) + 1) % 100;
    }, 200);
  }
  get tickInterval(): number | 'auto' {
    return this.slider.showTicks ? (this.slider.autoTicks ? 'auto' : this.slider.tickInterval) : undefined;
  }
  set tickInterval(v) {
    this.slider.tickInterval = Number(v);
  }
  isDarkTheme = false;
  lastDialogResult: string;
  mode: string;
  value: string;
  animal: string;

  autocompleteControl = new FormControl();
  autocompleteOptions: string[] = ['One', 'Two', 'Three'];
  filteredAutocompleteOptions: Observable<string[]>;

  camfilIcons: CamfilIcon[];

  // tslint:disable-next-line:no-any
  foods: any[] = [
    { name: 'Pizza', rating: 'Excellent' },
    { name: 'Burritos', rating: 'Great' },
    { name: 'French fries', rating: 'Pretty good' },
  ];

  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

  selectedValue: string;

  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  pageEvent: PageEvent;

  games = [
    { value: 'rts-0', viewValue: 'Starcraft' },
    { value: 'rpg-1', viewValue: "Baldur's Gate" },
    { value: 'fps-2', viewValue: 'Doom' },
  ];

  progress = 0;
  slider = {
    autoTicks: false,
    disabled: false,
    invert: false,
    max: 100,
    min: 0,
    showTicks: false,
    step: 1,
    thumbLabel: false,
    value: 0,
    vertical: false,
    tickInterval: 1,
    checked: true,
  };

  tiles = [
    { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
    { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
    { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
  ];

  color: string;

  availableColors = [
    { name: 'N/A', color: '' },
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warn', color: 'warn' },
  ];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  visibleFruits = true;
  selectableFruits = true;
  removableFruits = true;
  addOnBlurFruits = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [{ name: 'Lemon' }, { name: 'Lime' }, { name: 'Apple' }];

  hiddenBadge = false;

  step = 0;

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();

  @ViewChild(MatSort) sort: MatSort;

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  private autocompleteFilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autocompleteOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  toggleBadgeVisibility() {
    this.hiddenBadge = !this.hiddenBadge;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.camfilIcons = getCamfilIcons();
  }

  ngOnInit() {
    this.filteredAutocompleteOptions = this.autocompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => this.autocompleteFilter(value))
    );
  }

  openBottomSheet(): void {
    this.bottomSheet.open(DemoBottomSheetComponent);
  }

  addFruit(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeFruit(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DemoDialogComponent, {
      data: {
        animal: this.animal,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.lastDialogResult = result;
    });
  }

  showSnackbar() {
    this.snackBar.open('YUM SNACKS', 'CHEW');
  }
}
