// tslint:disable:ish-ordered-imports

require('jest-preset-angular');

require('jest-extended');

import { getTestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'ish-shared/material/material.module';

beforeEach(() => {
  const testBed = getTestBed();
  // tslint:disable-next-line: no-any
  testBed.configureCompiler({ preserveWhitespaces: false } as any);
  testBed.configureTestingModule({
    imports: [
      MaterialModule,
      MatIconTestingModule,
      FormsModule,
      ReactiveFormsModule,
      NoopAnimationsModule,
      TranslateModule.forRoot(),
    ],
  });

  jest.spyOn(global.console, 'warn').mockImplementation(arg => {
    if (
      typeof arg !== 'string' ||
      !(
        arg.startsWith('Navigation triggered outside Angular zone') ||
        arg.startsWith('A router outlet has not been instantiated during routes activation. URL Segment:')
      )
    ) {
      // tslint:disable-next-line:no-console
      console.log(arg);
    }
  });
});

afterEach(() => jest.clearAllTimers());

Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
});

// fix for TypeError, see https://github.com/telerik/kendo-angular/issues/1505#issuecomment-385882188
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});

// In Node v7 unhandled promise rejections will terminate the process
if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
  // tslint:disable-next-line:no-any
  process.on('unhandledRejection', (reason: Error | any) => {
    // To avoid memory leaks do not just log the error, but throw it to make sure jest test will return a non-zero exit code.
    // This is very useful in a ci context.
    throw reason;
  });
  // Avoid memory leak by adding too many listeners
  process.env.LISTENING_TO_UNHANDLED_REJECTION = 'true';
}
