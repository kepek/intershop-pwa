// tslint:disable:ish-ordered-imports
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

require('jest-preset-angular');

require('jest-extended');

import { getTestBed } from '@angular/core/testing';
import { MaterialModule } from 'camfil-shared/material/material.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

beforeEach(() => {
  const testBed = getTestBed();
  // tslint:disable-next-line: no-any
  testBed.configureCompiler({ preserveWhitespaces: false } as any);
  testBed.configureTestingModule({
    imports: [MaterialModule, MatIconTestingModule, FormsModule, ReactiveFormsModule, NoopAnimationsModule],
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
