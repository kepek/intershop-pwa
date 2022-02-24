import { CamfilChannelConfiguration } from './camfil-channel-configuration.model';

export class CamfilChannelConfigurationHelper {
  static getSettingsByChannelName(
    settings: { [key: string]: CamfilChannelConfiguration } | CamfilChannelConfiguration,
    channelName: string,
    channelKey: keyof CamfilChannelConfiguration = 'icmChannel'
  ): CamfilChannelConfiguration {
    if (settings[channelKey] === channelName) {
      return settings as CamfilChannelConfiguration;
    }

    // tslint:disable-next-line:one-variable-per-declaration
    let result, p;

    for (p in settings) {
      if (settings.hasOwnProperty(p) && typeof settings[p] === 'object') {
        result = CamfilChannelConfigurationHelper.getSettingsByChannelName(settings[p], channelName);
        if (result) {
          return result;
        }
      }
    }

    return result;
  }
}
