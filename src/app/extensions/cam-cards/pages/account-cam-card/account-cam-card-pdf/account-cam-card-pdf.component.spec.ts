import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { CamfilPriceSummaryPipe } from 'ish-core/pipes/camfil-price-summary.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { AccountCamCardPdfComponent } from './account-cam-card-pdf.component';

describe('Account Cam Card Pdf Component', () => {
  let component: AccountCamCardPdfComponent;
  let fixture: ComponentFixture<AccountCamCardPdfComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountCamCardPdfComponent,
        CamfilLoadingComponent,
        MockComponent(CamfilSmallCtaModalComponent),
        MockPipe(CamfilPriceSummaryPipe),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [provideMockStore(), CamfilPriceSummaryPipe, DatePipe],
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
