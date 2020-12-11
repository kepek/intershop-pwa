import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,
  production: true,
  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: 'http://localhost:4200',
  /* ICM PROXY CONFIGURATION */
  icmProxyURL: 'https://gruchot.hopto.org:42443',
};
