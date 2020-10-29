import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CamCardPreferencesComponent } from './cam-card-preferences.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';

describe('Cam Card Preferences Component', () => {
  let component: CamCardPreferencesComponent;
  let fixture: ComponentFixture<CamCardPreferencesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamCardPreferencesComponent, CamfilErrorComponent],
      providers: [provideMockStore({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamCardPreferencesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
