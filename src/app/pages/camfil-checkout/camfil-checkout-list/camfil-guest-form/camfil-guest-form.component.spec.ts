import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamfilGuestFormComponent } from './camfil-guest-form.component';

describe('CamfilGuestFormComponent', () => {
  let component: CamfilGuestFormComponent;
  let fixture: ComponentFixture<CamfilGuestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamfilGuestFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilGuestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
