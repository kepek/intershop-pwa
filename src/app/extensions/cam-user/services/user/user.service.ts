import { Injectable } from '@angular/core';

import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiService: ApiService) {}

  getUser() {
    return this.apiService.get('user');
  }
}
