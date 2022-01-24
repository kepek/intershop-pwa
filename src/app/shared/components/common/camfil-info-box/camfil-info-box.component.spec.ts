import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { CamfilInfoBoxComponent } from './camfil-info-box.component';

describe('Camfil Info Box Component', () => {
  let component: CamfilInfoBoxComponent;
  let fixture: ComponentFixture<CamfilInfoBoxComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [CamfilInfoBoxComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilInfoBoxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display an edit link if no editRouterLink is given', () => {
    component.editRouterLink = undefined;
    fixture.detectChanges();
    expect(element.querySelector('[title]')).toBeFalsy();
  });

  it('should display an edit link if editRouterLink is given', () => {
    component.editRouterLink = '/checkout/address';
    fixture.detectChanges();
    expect(element.querySelector('[title]')).toBeTruthy();
  });
});
