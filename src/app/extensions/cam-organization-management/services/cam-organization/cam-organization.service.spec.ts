import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { getSelectedCustomerId } from '../../store/customer';

import { CamOrganizationService } from './cam-organization.service';

describe('Cam Organization Service', () => {
  let apiServiceMock: ApiService;
  let camOrganizationService: CamOrganizationService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({
          selectors: [{ selector: getSelectedCustomerId, value: '12345' }],
        }),
      ],
    });
    camOrganizationService = TestBed.inject(CamOrganizationService);
  });

  it('should be created', () => {
    expect(camOrganizationService).toBeTruthy();
  });
});
