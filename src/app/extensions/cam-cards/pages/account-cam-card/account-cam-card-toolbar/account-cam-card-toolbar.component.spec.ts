import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCamCardToolbarComponent } from './account-cam-card-toolbar.component';

describe('AccountCamCardToolbarComponent', () => {
  let component: AccountCamCardToolbarComponent;
  let fixture: ComponentFixture<AccountCamCardToolbarComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountCamCardToolbarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCamCardToolbarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
