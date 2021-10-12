import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ServerConfigData } from 'ish-core/models/server-config/server-config.interface';
import { ServerConfigMapper } from 'ish-core/models/server-config/server-config.mapper';
import { ServerConfig } from 'ish-core/models/server-config/server-config.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { ChannelConfiguration } from '../../store/configuration/configuration.reducer';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private modeValue: 'server' | 'file' = 'file';
  private configHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.configuration.v1+json',
  });

  constructor(private apiService: ApiService, private appFacade: AppFacade) {}

  get mode() {
    return this.modeValue;
  }

  set mode(mode) {
    this.modeValue = mode;
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
    return from(import('../../settings')).pipe(
      withLatestFrom(this.appFacade.getChannel$),
      map(([module, channel]) => ({ data: { ...this.getSettingsByChannelName(module.default, channel) } })),
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
