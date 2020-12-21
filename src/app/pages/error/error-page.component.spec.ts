import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';

import { CamfilErrorComponent } from './camfil-error/camfil-error.component';
import { ErrorPageComponent } from './error-page.component';
import { ServerErrorComponent } from './server-error/server-error.component';

describe('Error Page Component', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorPageComponent, MockComponent(CamfilErrorComponent), MockComponent(ServerErrorComponent)],
      providers: [{ provide: AppFacade, useFactory: () => instance(mock(AppFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
