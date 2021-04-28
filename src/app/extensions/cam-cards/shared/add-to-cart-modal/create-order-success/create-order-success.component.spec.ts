import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { Product } from 'ish-core/models/product/product.model';
import { CamfilCamCardModalComponent } from 'ish-shared/components/common/camfil-cam-card-modal/camfil-cam-card-modal.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';

import { CreateOrderSuccessComponent } from './create-order-success.component';

describe('Create Order Success Component', () => {
  let component: CreateOrderSuccessComponent;
  let fixture: ComponentFixture<CreateOrderSuccessComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilCamCardModalComponent,
        CreateOrderSuccessComponent,
        MockComponent(LoadingComponent),
        MockComponent(ZipCodeComponent),
      ],
      imports: [NgbModalModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrderSuccessComponent);
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
