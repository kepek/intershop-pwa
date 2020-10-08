import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CamfilHeaderBoxComponent } from 'ish-shared/components/common/camfil-header-box/camfil-header-box.component';

import { LoginNewCustomerComponent } from './login-new-customer.component';

describe('Login New Customer Component', () => {
  let component: LoginNewCustomerComponent;
  let fixture: ComponentFixture<LoginNewCustomerComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilHeaderBoxComponent, LoginNewCustomerComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginNewCustomerComponent);
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
