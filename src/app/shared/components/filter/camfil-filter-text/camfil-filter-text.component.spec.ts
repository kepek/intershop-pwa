import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { Filter } from 'ish-core/models/filter/filter.model';
import { SanitizePipe } from 'ish-core/pipes/sanitize.pipe';

import { CamfilFilterTextComponent } from './camfil-filter-text.component';

describe('Camfil Filter Text Component', () => {
  let component: CamfilFilterTextComponent;
  let fixture: ComponentFixture<CamfilFilterTextComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, TranslateModule.forRoot()],
      declarations: [CamfilFilterTextComponent, MockComponent(FaIconComponent), SanitizePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    const filterElement = {
      name: 'Brands',
      limitCount: -1,
      facets: [
        { name: 'AsusName', level: 0, count: 4, displayName: 'Asus' },
        { name: 'LogitechName', level: 0, count: 5, displayName: 'Logitech', selected: true },
      ],
    } as Filter;
    fixture = TestBed.createComponent(CamfilFilterTextComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.filterElement = filterElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <ul class="filter-list">
        <li class="filter-item filter-layer0">
          <a class="filter-item-name" data-testing-id="filter-link-AsusName">
            Asus
            <mat-checkbox
              class="example-margin mat-checkbox mat-accent _mat-animation-noopable ng-untouched ng-pristine ng-valid"
              ng-reflect-model="false"
              id="mat-checkbox-1"
              ><label class="mat-checkbox-layout" for="mat-checkbox-1-input"
                ><div class="mat-checkbox-inner-container mat-checkbox-inner-container-no-side-margin">
                  <input
                    class="mat-checkbox-input cdk-visually-hidden"
                    type="checkbox"
                    id="mat-checkbox-1-input"
                    tabindex="0"
                    aria-checked="false"
                  />
                  <div
                    class="mat-checkbox-ripple mat-focus-indicator mat-ripple"
                    matripple=""
                    ng-reflect-centered="true"
                    ng-reflect-radius="20"
                    ng-reflect-disabled="false"
                    ng-reflect-trigger="[object HTMLLabelElement]"
                  >
                    <div class="mat-ripple-element mat-checkbox-persistent-ripple"></div>
                  </div>
                  <div class="mat-checkbox-frame"></div>
                  <div class="mat-checkbox-background">
                    <svg
                      xml:space="preserve"
                      class="mat-checkbox-checkmark"
                      focusable="false"
                      version="1.1"
                      viewBox="0 0 24 24"
                    >
                      <path
                        class="mat-checkbox-checkmark-path"
                        d="M4.1,12.7 9,17.6 20.3,6.3"
                        fill="none"
                        stroke="white"
                      ></path>
                    </svg>
                    <div class="mat-checkbox-mixedmark"></div>
                  </div>
                </div>
                <span class="mat-checkbox-label"><span style="display: none;">&nbsp;</span></span></label
              ></mat-checkbox
            ></a
          >
        </li>
        <li class="filter-item filter-layer0 filter-selected">
          <a data-testing-id="filter-link-LogitechName"
            ><span class="filter-item-name"> Logitech </span
            ><mat-checkbox
              class="example-margin mat-checkbox mat-accent _mat-animation-noopable ng-untouched ng-pristine ng-valid"
              ng-reflect-model="true"
              id="mat-checkbox-2"
              ><label class="mat-checkbox-layout" for="mat-checkbox-2-input"
                ><div class="mat-checkbox-inner-container mat-checkbox-inner-container-no-side-margin">
                  <input
                    class="mat-checkbox-input cdk-visually-hidden"
                    type="checkbox"
                    id="mat-checkbox-2-input"
                    tabindex="0"
                    aria-checked="false"
                  />
                  <div
                    class="mat-checkbox-ripple mat-focus-indicator mat-ripple"
                    matripple=""
                    ng-reflect-centered="true"
                    ng-reflect-radius="20"
                    ng-reflect-disabled="false"
                    ng-reflect-trigger="[object HTMLLabelElement]"
                  >
                    <div class="mat-ripple-element mat-checkbox-persistent-ripple"></div>
                  </div>
                  <div class="mat-checkbox-frame"></div>
                  <div class="mat-checkbox-background">
                    <svg
                      xml:space="preserve"
                      class="mat-checkbox-checkmark"
                      focusable="false"
                      version="1.1"
                      viewBox="0 0 24 24"
                    >
                      <path
                        class="mat-checkbox-checkmark-path"
                        d="M4.1,12.7 9,17.6 20.3,6.3"
                        fill="none"
                        stroke="white"
                      ></path>
                    </svg>
                    <div class="mat-checkbox-mixedmark"></div>
                  </div>
                </div>
                <span class="mat-checkbox-label"><span style="display: none;">&nbsp;</span></span></label
              ></mat-checkbox
            ></a
          >
        </li>
      </ul>
    `);
  });
});
