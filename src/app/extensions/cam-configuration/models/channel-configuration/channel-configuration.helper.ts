import { ChannelConfiguration } from './channel-configuration.model';

export class ChannelConfigurationHelper {
  static getSettingsByChannelName(
    settings: { [key: string]: ChannelConfiguration } | ChannelConfiguration,
    channelName: string,
    channelKey: keyof ChannelConfiguration = 'icmChannel'
  ): ChannelConfiguration {
    if (settings[channelKey] === channelName) {
      return settings as ChannelConfiguration;
    }

    // tslint:disable-next-line:one-variable-per-declaration
    let result, p;

    for (p in settings) {
      if (settings.hasOwnProperty(p) && typeof settings[p] === 'object') {
        result = ChannelConfigurationHelper.getSettingsByChannelName(settings[p], channelName);
        if (result) {
          return result;
        }
      }
    }

    return result;
  }
}
