import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CamfilBreadcrumbComponent } from 'ish-shared/components/common/camfil-breadcrumb/camfil-breadcrumb.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductGuidesComponent } from 'ish-shared/components/product/camfil-product-guides/camfil-product-guides.component';

import { CamfilAHUPageDetailComponent } from './camfil-ahu-page-detail.component';

describe('Camfil Ahu Page Detail Component', () => {
  let component: CamfilAHUPageDetailComponent;
  let fixture: ComponentFixture<CamfilAHUPageDetailComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CamfilAHUPageDetailComponent,
        MockComponent(CamfilBreadcrumbComponent),
        MockComponent(CamfilProductGuidesComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAHUPageDetailComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
