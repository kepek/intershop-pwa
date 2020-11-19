import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AccountCamCardDetailSubTitleComponent } from './account-cam-card-detail-sub-title.component';

describe('Account Cam Card Detail Sub Title Component', () => {
  let component: AccountCamCardDetailSubTitleComponent;
  let fixture: ComponentFixture<AccountCamCardDetailSubTitleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountCamCardDetailSubTitleComponent],
      imports: [TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCamCardDetailSubTitleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    component.sub = { name: 'test' };
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
