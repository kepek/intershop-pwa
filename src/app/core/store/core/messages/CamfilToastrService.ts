// tslint:disable: project-structure ish-ordered-imports
import { Inject, Injectable, Injector, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { IndividualConfig, Overlay, ToastrService, ToastToken, TOAST_CONFIG } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class CamfilToastrService extends ToastrService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  // tslint:disable-next-line:variable-name
  constructor(
    @Inject(TOAST_CONFIG)
    token: ToastToken,
    overlay: Overlay,
    // tslint:disable-next-line:variable-name
    _injector: Injector,
    sanitizer: DomSanitizer,
    ngZone: NgZone,
    private snackBar: MatSnackBar
  ) {
    super(token, overlay, _injector, sanitizer, ngZone);
  }
  // tslint:disable-next-line:no-any force-jsdoc-comments
  // @ts-ignore
  info(message?: string, action?: string, override?: Partial<IndividualConfig>): void {
    this.snackBar.open(message, action, {
      duration: override.timeOut,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['info-snackbar'],
    });
  }
  // tslint:disable-next-line:no-any force-jsdoc-comments
  // @ts-ignore
  error(message?: string, action?: string, override?: Partial<IndividualConfig>): void {
    this.snackBar.open(message, action, {
      duration: override.timeOut,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['error-snackbar'],
    });
    // tslint:disable-next-line:no-commented-out-code
    // return super.error(message, title, override);
  }
  // tslint:disable-next-line:no-any force-jsdoc-comments
  // @ts-ignore
  warning(message?: string, action?: string, override?: Partial<IndividualConfig>): void {
    this.snackBar.open(message, action, {
      duration: override.timeOut,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['warning-snackbar'],
    });
    // tslint:disable-next-line:no-commented-out-code
    // return super.warning(message, title, override);
  }
  // tslint:disable-next-line:no-any force-jsdoc-comments
  // @ts-ignore
  success(message?: string, action?: string, override?: Partial<IndividualConfig>): void {
    this.snackBar.open(message, action, {
      duration: override.timeOut,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['success-snackbar'],
    });
    // tslint:disable-next-line:no-commented-out-code
    // return super.success(message, title, override);
  }
}
