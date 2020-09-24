import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';

import { HomePageComponent } from './home-page.component';

describe('Home Page Component', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePageComponent, MockComponent(ContentIncludeComponent)],
      imports: [BrowserAnimationsModule, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  xit('should render home page include when rendered', () => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <ish-content-include
        includeid="include.homepage.content.pagelet2-Include"
        ng-reflect-include-id="include.homepage.content.pagel"
      ></ish-content-include>
    `);
  });
});
