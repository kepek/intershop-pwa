import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { CamfilLanguageSwitchComponent } from 'ish-shell/header/camfil-language-switch/camfil-language-switch.component';

import { CamfilUserLinksComponent } from './camfil-user-links.component';

describe('Camfil User Links Component', () => {
  let component: CamfilUserLinksComponent;
  let fixture: ComponentFixture<CamfilUserLinksComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamfilUserLinksComponent, MockComponent(CamfilLanguageSwitchComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilUserLinksComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
