import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import xlsxParser from 'xlsx-parse-json';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { takeUntil } from 'rxjs/operators';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
const mockResponse = [
  {
    originalLineNumber: 1,
    name: 'Columbus SE_2',
    customerNumber: '111811',
    orderMark: 'Test Order',
    invoiceMark: 'Test Invoice',
    customerRecipientName: 'Columbus Gothenburg',
    deliveryAddressBuilding: 'A',
    deliveryAddressStreet: 'Drottninggatan 71D',
    deliveryAddressZipCode: '11220',
    deliveryAddressCity: 'Stockholm',
    deliveryAddressCountryCode: null,
    deliveryInterval: 12,
    boxLabel: 'This is for Pawel',
    camCardLines: [
      {
        originalLineNumber: 1,
        sku: null,
        quantity: 42,
        width: null,
        height: null,
        diameter: null,
        errors: [
          {
            errorCode: 'web_cc_import.validation_error.empty_or_invalid_value',
            errorParameters: ['SKU'],
          },
        ],
        name: null,
        customerNumber: null,
        orderMark: null,
        invoiceMark: null,
        customerRecipientName: null,
        deliveryAddressBuilding: null,
        deliveryAddressStreet: null,
        deliveryAddressZipCode: null,
        deliveryAddressCity: null,
        deliveryAddressCountryCode: null,
        deliveryInterval: null,
        boxLabel: null,
      },
      {
        originalLineNumber: 2,
        sku: '1004670',
        quantity: 43,
        width: null,
        height: null,
        diameter: null,
        errors: [],
        name: null,
        customerNumber: null,
        orderMark: null,
        invoiceMark: null,
        customerRecipientName: null,
        deliveryAddressBuilding: null,
        deliveryAddressStreet: null,
        deliveryAddressZipCode: null,
        deliveryAddressCity: null,
        deliveryAddressCountryCode: null,
        deliveryInterval: null,
        boxLabel: null,
      },
      {
        originalLineNumber: 3,
        sku: '1000301',
        quantity: 44,
        width: null,
        height: null,
        diameter: null,
        errors: [
          {
            errorCode: 'web_cc_import.validation_error.empty_or_invalid_value',
            errorParameters: ['Quantity'],
          },
        ],
        name: null,
        customerNumber: null,
        orderMark: null,
        invoiceMark: null,
        customerRecipientName: null,
        deliveryAddressBuilding: null,
        deliveryAddressStreet: null,
        deliveryAddressZipCode: null,
        deliveryAddressCity: null,
        deliveryAddressCountryCode: null,
        deliveryInterval: null,
        boxLabel: null,
      },
    ],
    errors: [],
  },
];

@Component({
  selector: 'camfil-import-cam-card-dialog',
  templateUrl: './import-cam-card-dialog.component.html',
  styleUrls: ['./import-cam-card-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportCamCardDialogComponent implements OnInit, OnDestroy {
  parsedFile;
  files: any[] = [];
  file: any = {};
  loading = false;
  validRows = [];
  invalidRows = [];
  camCard = [];
  isValidationCompleted = false;
  camCardLoading$: Observable<boolean>;
  validationErrors$: Observable<HttpError>;
  validationResponse$: Observable<[]>;
  errorArr: any[];
  private destroy$ = new Subject<void>();

  validationErrors: string[];
  constructor(
    private ref: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ImportCamCardDialogComponent>,
    private camCardsFacade: CamCardsFacade
  ) {}

  ngOnInit() {
    this.validationErrors = [];
    this.validationErrors$ = this.camCardsFacade.validationErrors$;
    this.validationResponse$ = this.camCardsFacade.validationResponse$;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileChange(files) {
    //TODO: check excel types
    this.loading = true;
    const allowedFileTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (files.length > 0) {
      const file = files[0];
      const fileType = file.type;
      if (allowedFileTypes?.includes(fileType)) {
        // this.files.push(file);
        this.file = file;
        xlsxParser.onFileSelection(file).then(data => {
          this.parsedFile = data;
          // this.validateProcessedData(data);

          this.camCardsFacade.validateCamCardImport(data);
          this.camCardLoading$ = this.camCardsFacade.camCardLoading$;
          this.camCardLoading$.pipe(takeUntil(this.destroy$)).subscribe(value => {
            if (!value) {
              setTimeout(() => {
                this.isValidationCompleted = true;
                this.loading = false;
                this.ref.detectChanges();
              }, 1000);
            }
          });
          // TODO: Change to get valdiation response and extract errors

          let errorsArr = mockResponse[0].camCardLines?.map(line => {
            if (line.errors && line.errors.length) {
              return { lineNumber: line.originalLineNumber, errors: [...line.errors] };
            }
          });
          //.map(error => `Parameter: ${error.errorParameters.join(",")} error code: ${error.errorCode}`)
          // this.validationErrors = [...errorsArr]
          console.log(
            'errorsArr',
            errorsArr.filter(item => item)
          );
          this.errorArr = [...errorsArr.filter(item => item)];
          this.validationErrors$.pipe(takeUntil(this.destroy$)).subscribe(value => {
            console.log('validationErrors', value);
            if (value) {
              this.validationErrors = [value?.message];
            }
          });
        });
      } else {
        this.validationErrors = ['CamCards can only be imported via an .xlsx file'];
      }
    }
  }

  submitImportCamCardForm() {
    if (this.validRows && this.validRows.length) {
      this.camCardsFacade.importCamCard(this.validRows);
      this.camCardLoading$ = this.camCardsFacade.camCardLoading$;
      this.camCardLoading$.pipe(takeUntil(this.destroy$)).subscribe(value => {
        if (!value) {
          this.dialogRef.close();
        }
      });
    }
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.onFileChange($event);
  }

  validateProcessedData(data) {
    const camCardArr = data[Object.keys(data)[0]];
    camCardArr?.forEach(row => {
      if (!row.Quantity || row.Quantity <= 0) {
        console.log('Quantity value is not valid');
        this.invalidRows.push({ row: row, errors: ['Invalid quantity'] });
      } else {
        this.validRows.push(row);
        if (row['CamCards name']) {
          this.camCard.push(row);
        }
      }
    });

    if (this.camCard && this.camCard.length === 1) {
    } else if (this.camCard.length > 1) {
      this.validationErrors.push('File contains more than one CamCard row');
    } else {
      this.validationErrors.push("File doesn't contain CamCard row");
    }

    setTimeout(() => {
      this.isValidationCompleted = true;
      this.loading = false;
      this.ref.detectChanges();
    }, 1000);
  }
}
