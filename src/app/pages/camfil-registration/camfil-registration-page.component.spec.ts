import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CamfilBannerComponent } from 'ish-shared/components/camfil-banner/camfil-banner.component';
import { CamfilBulletListComponent } from 'ish-shared/components/camfil-bullet-list/camfil-bullet-list.component';
import { CamfilHeaderBoxComponent } from 'ish-shared/components/common/camfil-header-box/camfil-header-box.component';

import { CamfilInfoSectionComponent } from './camfil-info-section/camfil-info-section.component';
import { CamfilRegistrationFormComponent } from './camfil-registration-form/camfil-registration-form.component';
import { CamfilRegistrationPageComponent } from './camfil-registration-page.component';

describe('Camfil Registration Page Component', () => {
  let fixture: ComponentFixture<CamfilRegistrationPageComponent>;
  let component: CamfilRegistrationPageComponent;
  let element: HTMLElement;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilBannerComponent,
        CamfilBulletListComponent,
        CamfilHeaderBoxComponent,
        CamfilInfoSectionComponent,
        CamfilRegistrationPageComponent,
        DummyComponent,
        MockComponent(CamfilRegistrationFormComponent),
      ],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'home', component: DummyComponent }]),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRegistrationPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
