import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ServerConfigData } from 'ish-core/models/server-config/server-config.interface';
import { ServerConfigMapper } from 'ish-core/models/server-config/server-config.mapper';
import { ServerConfig } from 'ish-core/models/server-config/server-config.model';
import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  constructor(private apiService: ApiService) {}

  private configHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.configuration.v1+json',
  });

  /**
   * Gets the ICM camfil configuration parameters.
   * @returns           The configuration object.
   */
  getCamfilServerConfiguration(): Observable<ServerConfig> {
    return (
      this.apiService
        // TODO (extMlk): This GET request should point to `camfil_configurations`
        .get<ServerConfigData>(`configurations`, {
          headers: this.configHeaders,
        })
        .pipe(
          map(serverConfigData => {
            if (serverConfigData?.data) {
              // TODO (extMlk): Remove this fakeConfig section whenever back-end will deliver `/camfil_configurations`
              serverConfigData.data.fakeConfig = serverConfigData.data.fakeConfig || {
                apiBaseURL: 'http://example.org/api/icc',
                apiToken: 'OOOO-PPPP-XXXX-QQQQ',
              };
            }

            return ServerConfigMapper.fromData(serverConfigData);
          })
        )
    );
  }
}
