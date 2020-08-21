import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MockComponent } from 'ng-mocks';

import { CamfilFilterCollapsableComponent } from './camfil-filter-collapsable.component';

describe('Filter Collapsable Component', () => {
  let component: CamfilFilterCollapsableComponent;
  let fixture: ComponentFixture<CamfilFilterCollapsableComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbCollapseModule],
      declarations: [CamfilFilterCollapsableComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilFilterCollapsableComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  xit('should hide content when header is clicked', fakeAsync(() => {
    fixture.detectChanges();
    expect(element).toMatchSnapshot('open');
    const filterGroupHead = fixture.nativeElement.querySelectorAll('h3')[0];
    filterGroupHead.click();
    tick(500);
    fixture.detectChanges();

    expect(element).toMatchSnapshot('closed');
  }));
});
