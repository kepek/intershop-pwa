import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { DatePipe } from 'ish-core/pipes/date.pipe';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountCamCardPdfComponent } from './account-cam-card-pdf.component';

describe('Account Cam Card Pdf Component', () => {
  let component: AccountCamCardPdfComponent;
  let fixture: ComponentFixture<AccountCamCardPdfComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountCamCardPdfComponent, CamfilSmallCtaModalComponent, LoadingComponent],
      imports: [TranslateModule.forRoot()],
      providers: [provideMockStore(), DatePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCamCardPdfComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
