import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { CamfilRegistrationCompanyFormComponent } from './camfil-registration-company-form.component';

describe('Camfil Registration Company Form Component', () => {
  let component: CamfilRegistrationCompanyFormComponent;
  let fixture: ComponentFixture<CamfilRegistrationCompanyFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CamfilRegistrationCompanyFormComponent, MockComponent(InputComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRegistrationCompanyFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show form fields after creation ', () => {
    fixture.detectChanges();

    expect(element.querySelectorAll('ish-input')).toHaveLength(1);
  });
});
