import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Observable, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';

import { DemoBottomSheetComponent } from './demo-bottom-sheet/demo-bottom-sheet.component';
import { DemoDialogComponent } from './demo-dialog/demo-dialog.component';

export interface Fruit {
  name: string;
}

export interface BuildingProductRow {
  name: string;
  checked: boolean;
}

export interface BuildingPeriodicElement {
  name: string;
  checked: boolean;
  products: BuildingProductRow[];
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  buildings: BuildingPeriodicElement[];
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'CamCard Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    buildings: [
      {
        name: 'Building 1',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
      {
        name: 'Building 2',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
    ],
  },
  {
    position: 2,
    name: 'CamCard test',
    weight: 4.0026,
    symbol: 'He',
    buildings: [
      {
        name: 'Building 1',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
      {
        name: 'Building 2',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
    ],
  },
  {
    position: 3,
    name: 'CamCard Lithium',
    weight: 6.941,
    symbol: 'Li',
    buildings: [
      {
        name: 'Building 1',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
      {
        name: 'Building 2',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
    ],
  },
  {
    position: 4,
    name: 'CamCard Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    buildings: [
      {
        name: 'Building 1',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
      {
        name: 'Building 2',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
    ],
  },
  {
    position: 5,
    name: 'CamCard Boron',
    weight: 10.811,
    symbol: 'B',
    buildings: [
      {
        name: 'Building 1',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
      {
        name: 'Building 2',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
    ],
  },
  {
    position: 6,
    name: 'CamCard Carbon',
    weight: 12.0107,
    symbol: 'C',
    buildings: [
      {
        name: 'Building 1',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
      {
        name: 'Building 2',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
    ],
  },
  {
    position: 7,
    name: 'CamCard Nitrogen',
    weight: 14.0067,
    symbol: 'N',
    buildings: [
      {
        name: 'Building 1',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
      {
        name: 'Building 2',
        checked: false,
        products: [
          { name: 'product sku - 12345', checked: false },
          { name: 'product2 sku - 98265', checked: false },
          { name: 'product3 sku - 52489', checked: false },
        ],
      },
    ],
  },
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
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DemoPageComponent implements AfterViewInit, OnInit, OnDestroy {
  private destroy$ = new Subject();

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

  /** for camCards */
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay = ['name', 'weight', 'symbol', 'position', 'checkbox'];
  expandedElement: PeriodicElement | null;
  selection = new SelectionModel<PeriodicElement>(true, []);
  /** EOF camCards */

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


  /** for camCards */
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /** deeper level for checkbox */
  allChecked(item: BuildingPeriodicElement): boolean {
    return item.checked;
  }

  updateAllChecked(item: BuildingPeriodicElement) {
    item.checked = item.products !== null && item.products.every(t => t.checked);
  }

  someChecked(item: BuildingPeriodicElement): boolean {
    if (item.products === null) {
      return false;
    }
    return item.products.filter(t => t.checked).length > 0 && !item.checked;
  }

  setAll(item: BuildingPeriodicElement, checked: boolean) {
    item.checked = checked;
    if (item.products === null) {
      return;
    }
    item.products.forEach(t => (t.checked = checked));
  }

  /** EOF for camCards */




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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

    dialogRef
      .afterClosed()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(result => {
        this.lastDialogResult = result;
      });
  }

  showSnackbar() {
    this.snackBar.open('YUM SNACKS', 'CHEW');
  }
}
