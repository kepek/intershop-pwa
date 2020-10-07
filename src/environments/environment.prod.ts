import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,
  icmBaseURL: 'https://intershoppwa.azurewebsites.net',
  icmChannel: 'inSPIRED-inTRONICS_Business-Site',
  icmApplication: '-',
  production: true,
};
