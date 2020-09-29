import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilLoginNewCustomerComponent } from './camfil-login-new-customer.component';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CamfilHeaderBoxComponent} from "ish-shared/components/common/camfil-header-box/camfil-header-box.component";

describe('CamfilLoginNewCustomerComponent', () => {
  let component: CamfilLoginNewCustomerComponent;
  let fixture: ComponentFixture<CamfilLoginNewCustomerComponent>;
  let element: HTMLElement;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilLoginNewCustomerComponent, CamfilHeaderBoxComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilLoginNewCustomerComponent);
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
