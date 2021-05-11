import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import xlsxParser from 'xlsx-parse-json';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCardImportValidationResponse } from '../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-import-cam-card-dialog',
  templateUrl: './import-cam-card-dialog.component.html',
  styleUrls: ['./import-cam-card-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportCamCardDialogComponent implements OnInit, OnDestroy {
  parsedFile: File = undefined;
  file: File = undefined;
  isValidationCompleted = false;
  importSubmitted = false;
  camCardLoading$: Observable<boolean>;
  validationResponse$: Observable<CamCardImportValidationResponse>;
  errorsArr = [];
  private destroy$ = new Subject<void>();

  validationErrors: string[];
  constructor(
    private ref: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ImportCamCardDialogComponent>,
    private camCardsFacade: CamCardsFacade
  ) {}

  ngOnInit() {
    this.validationErrors = [];
    this.validationResponse$ = this.camCardsFacade.validationResponse$;
    this.camCardLoading$ = this.camCardsFacade.camCardLoading$;

    this.camCardLoading$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (!value && this.importSubmitted) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileChange(files) {
    const allowedFileTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (files.length) {
      const file = files[0];
      const fileType = file.type;
      if (allowedFileTypes?.includes(fileType)) {
        this.file = file;
        xlsxParser.onFileSelection(file).then(data => {
          this.parsedFile = data;

          this.camCardsFacade.validateCamCardImport(data);

          this.validationResponse$.pipe(takeUntil(this.destroy$)).subscribe(validationResponse => {
            if (validationResponse) {
              const camCardErrors = [];
              if (validationResponse.errors && validationResponse.errors?.length) {
                camCardErrors.push({
                  lineErrorHeaderType: 'camfil.account.import.line_header_cam_card.text',
                  errors: [...validationResponse.errors],
                });
              }

              const artiCleLinesErrors = validationResponse.camCardLines?.map(line => {
                if (line.errors && line.errors.length) {
                  return {
                    lineErrorHeaderType: 'camfil.account.import.line_header_line.text',
                    lineErrorNumber: line.originalLineNumber,
                    errors: [...line.errors],
                  };
                }
              });

              setTimeout(() => {
                this.isValidationCompleted = true;
                this.errorsArr = [...camCardErrors, ...artiCleLinesErrors.filter(item => item)];
                this.ref.detectChanges();
              }, 300);
            }
          });
        });
      } else {
        this.validationErrors = ['camfil.account.import.incorrect_file_type.text'];
      }
    }
  }

  /**
   * Send parsed file
   */

  submitImportCamCardForm() {
    if (this.isValidationCompleted && this.parsedFile) {
      this.importSubmitted = true;
      const dataToSend = this.parsedFile[Object.keys(this.parsedFile)[0]];
      this.camCardsFacade.importCamCard(dataToSend);
    }
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.onFileChange($event);
  }
}
