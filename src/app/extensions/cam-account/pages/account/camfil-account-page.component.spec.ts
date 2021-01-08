import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CamfilBreadcrumbComponent } from 'ish-shared/components/common/camfil-breadcrumb/camfil-breadcrumb.component';

import { CamfilAccountNavigationComponent } from './camfil-account-navigation/camfil-account-navigation.component';
import { CamfilAccountPageComponent } from './camfil-account-page.component';

describe('Camfil Account Page Component', () => {
  let fixture: ComponentFixture<CamfilAccountPageComponent>;
  let component: CamfilAccountPageComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilAccountPageComponent,
        MockComponent(CamfilAccountNavigationComponent),
        MockComponent(CamfilBreadcrumbComponent),
      ],
      imports: [RouterTestingModule],
      providers: [{ provide: AppFacade, useFactory: () => instance(mock(AppFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAccountPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
