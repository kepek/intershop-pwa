import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,
  production: true,
  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: 'https://api.shop.camfil.com',
  /* ICM PROXY CONFIGURATION */
  icmProxyURL: 'https://api.shop.camfil.com',
};
