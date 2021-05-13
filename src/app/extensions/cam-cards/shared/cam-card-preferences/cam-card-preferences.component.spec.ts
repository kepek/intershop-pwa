import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockPipe } from 'ng-mocks';

import { AddressSortPipe } from 'ish-core/pipes/camfil-address-sort.pipe';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';

import { CamCardPreferencesComponent } from './cam-card-preferences.component';

describe('Cam Card Preferences Component', () => {
  let component: CamCardPreferencesComponent;
  let fixture: ComponentFixture<CamCardPreferencesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamCardPreferencesComponent,
        CamfilErrorComponent,
        MockComponent(NgbCollapse),
        MockComponent(ZipCodeComponent),
        MockPipe(AddressSortPipe),
      ],
      imports: [RouterTestingModule],
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
