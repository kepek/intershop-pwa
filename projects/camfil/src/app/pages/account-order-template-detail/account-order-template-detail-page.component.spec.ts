import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AccountOrderTemplateDetailPageComponent } from './account-order-template-detail-page.component';

describe('Account Order Template Detail Page Component', () => {
  let component: AccountOrderTemplateDetailPageComponent;
  let fixture: ComponentFixture<AccountOrderTemplateDetailPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AccountOrderTemplateDetailPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderTemplateDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
