import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CamfilBulletListComponent } from 'ish-shared/components/common/camfil-bullet-list/camfil-bullet-list.component';
import { CamfilDetailsBoxComponent } from 'ish-shared/components/common/camfil-details-box/camfil-details-box.component';
import { CamfilHeaderBoxComponent } from 'ish-shared/components/common/camfil-header-box/camfil-header-box.component';

import { LoginInfoSectionComponent } from './login-info-section.component';

describe('Login Info Section Component', () => {
  let component: LoginInfoSectionComponent;
  let fixture: ComponentFixture<LoginInfoSectionComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilBulletListComponent,
        CamfilDetailsBoxComponent,
        CamfilHeaderBoxComponent,
        LoginInfoSectionComponent,
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginInfoSectionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
