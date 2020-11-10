import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCamCardModalComponent } from './create-cam-card-modal.component';
import {CamfilModalComponent} from "../camfil-modal/camfil-modal.component";
import {CamfilErrorComponent} from "ish-shared/components/common/camfil-error/camfil-error.component";
import {ArticleDetailsComponent} from "../article-details/article-details.component";
import {CamfilProductQuantityComponent} from "ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component";
import {CamfilCounterComponent} from "ish-shared/forms/components/camfil-counter/camfil-counter.component";
import {Product} from "ish-core/models/product/product.model";
import {CamCardsFacade} from "../../../facades/cam-cards.facade";
import {instance, mock} from "ts-mockito";

describe('Create Cam Card Modal Component', () => {
  let component: CreateCamCardModalComponent;
  let fixture: ComponentFixture<CreateCamCardModalComponent>;
  let element: HTMLElement;
  let camCardFacadeMock: CamCardsFacade;


  beforeEach(async () => {
    camCardFacadeMock = mock(CamCardsFacade);

    await TestBed.configureTestingModule({
      declarations: [CreateCamCardModalComponent,
        CamfilModalComponent,
        CamfilErrorComponent,
        ArticleDetailsComponent,
        CamfilProductQuantityComponent,
        CamfilCounterComponent
      ],
      providers: [{ provide: CamCardsFacade, useFactory: () => instance(camCardFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCamCardModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.product = { name: 'Test Product', sku: 'test sku', minOrderQuantity: 1 } as Product;

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
