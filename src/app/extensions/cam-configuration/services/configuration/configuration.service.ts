import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { ServerConfigData } from 'ish-core/models/server-config/server-config.interface';
import { ServerConfigMapper } from 'ish-core/models/server-config/server-config.mapper';
import { ServerConfig } from 'ish-core/models/server-config/server-config.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { ChannelConfiguration, ChannelSetting, ChannelSettings, channelConfig } from '../../settings';
import { getCamfilSettings } from '../../store/configuration';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private configHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.configuration.v1+json',
  });

  private modeValue: 'server' | 'file' = 'file';

  private settings$: Observable<Partial<ChannelSettings>>;

  constructor(private apiService: ApiService, private stateProperties: StatePropertiesService, store: Store) {
    this.settings$ = store.pipe(select(getCamfilSettings));
  }

  get mode() {
    return this.modeValue;
  }

  set mode(mode) {
    this.modeValue = mode;
  }

  isEnabled(setting: ChannelSetting): Observable<boolean> {
    return this.settings$.pipe(
      // wait for permissions to be loaded
      whenTruthy(),
      map(settings => !!settings?.[setting])
    );
  }

  getCamfilConfiguration() {
    switch (this.mode) {
      case 'file':
        return this.getCamfilConfigurationFromFile();
      case 'server':
        return this.getCamfilConfigurationFromServer();
      default:
        return of(undefined);
    }
  }

  /**
   * Gets the ICM camfil configuration parameters from server.
   * @private
   * @returns           The configuration object.
   */
  private getCamfilConfigurationFromServer(): Observable<ServerConfig> {
    return this.apiService
      .get<ServerConfigData>(`camfil_configurations`, {
        headers: this.configHeaders,
      })
      .pipe(map(serverConfigData => ServerConfigMapper.fromData(serverConfigData)));
  }

  /**
   * Gets the ICM camfil configuration parameters from file.
   * @private
   * @returns           The configuration object.
   */
  private getCamfilConfigurationFromFile(): Observable<ServerConfig> {
    return of(channelConfig).pipe(
      withLatestFrom(this.stateProperties.getStateOrEnvOrDefault<string>('ICM_CHANNEL', 'icmChannel')),
      map(([settings, channel]) => ({ data: { ...this.getSettingsByChannelName(settings, channel) } })),
      map(ServerConfigMapper.fromData)
    );
  }

  private getSettingsByChannelName(
    settings: { [key: string]: ChannelConfiguration } | ChannelConfiguration,
    channelName: string,
    channelKey: keyof ChannelConfiguration = 'icmChannel'
  ) {
    if (settings[channelKey] === channelName) {
      return settings;
    }

    // tslint:disable-next-line:one-variable-per-declaration
    let result, p;

    for (p in settings) {
      if (settings.hasOwnProperty(p) && typeof settings[p] === 'object') {
        result = this.getSettingsByChannelName(settings[p], channelName);
        if (result) {
          return result;
        }
      }
    }

    return result;
  }
}
