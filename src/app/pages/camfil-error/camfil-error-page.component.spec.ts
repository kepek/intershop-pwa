import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';

import { CamfilErrorPageComponent } from './camfil-error-page.component';
import { CamfilErrorComponent } from './camfil-error/camfil-error.component';
import { CamfilServerErrorComponent } from './camfil-server-error/camfil-server-error.component';

describe('Camfil Error Page Component', () => {
  let component: CamfilErrorPageComponent;
  let fixture: ComponentFixture<CamfilErrorPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilErrorPageComponent,
        MockComponent(CamfilErrorComponent),
        MockComponent(CamfilServerErrorComponent),
      ],
      providers: [{ provide: AppFacade, useFactory: () => instance(mock(AppFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilErrorPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
