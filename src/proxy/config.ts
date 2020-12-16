// tslint:disable: no-console ish-ordered-imports force-jsdoc-comments project-structure ban-specific-imports
import { Options } from 'http-proxy-middleware';
import { Environment } from '../environments/environment.model';
import { defaultAllowedDomains, defaultAllowedMethods, defaultHeaders, getHttpAgent, RequestMethod } from './index';

// TODO (extMlk): Talk with DevOps to change the name of the `PROXY_ICC` to `ICC_PROXY_URL` to remove below workaround.
if (!process.env.ICC_PROXY_URL && process.env.PROXY_ICC) {
  process.env.ICC_PROXY_URL = process.env.PROXY_ICC;
}

export interface Proxy extends Options {
  route: string;
  allowedMethods: RequestMethod[];
  allowedDomains?: string[];
}

export interface Config {
  allowedDomains: string[];
  proxies: Proxy[];
}

/**
 * Create Proxies Config
 * @param env
 */
export function createProxiesConfig(env: Environment): Config {
  function getSysEnvOrAppEnv(sysEnvKey: string, appEnvKey: string): string {
    const sysEnvVar = process && process.env[sysEnvKey];
    const appEnvVar = env[appEnvKey];
    return sysEnvVar && sysEnvVar.length ? sysEnvVar : appEnvVar;
  }

  const config: Config = {
    allowedDomains: ['http://example.com', ...defaultAllowedDomains],
    proxies: [],
  };

  /**
   *
   * Intershop-ICM
   *
   **/

  // Route -> /INTERSHOP/*
  const ICM_TARGET = getSysEnvOrAppEnv('ICM_PROXY_URL', 'icmProxyURL');

  config.proxies.push({
    route: getSysEnvOrAppEnv('ICM_SERVER', 'icmServer').split('/')[0],
    target: ICM_TARGET,
    allowedMethods: defaultAllowedMethods,
    agent: getHttpAgent(ICM_TARGET),
    headers: {
      ...defaultHeaders,
    },
  });

  /**
   *
   * Camfil-ICC
   *
   **/

  // Route -> /ICC/*
  const ICC_TARGET = getSysEnvOrAppEnv('ICC_PROXY_URL', 'iccProxyURL');

  config.proxies.push({
    route: getSysEnvOrAppEnv('ICC_SERVER', 'iccServer'),
    target: ICC_TARGET,
    allowedMethods: defaultAllowedMethods,
    agent: getHttpAgent(ICC_TARGET),
    headers: {
      ...defaultHeaders,
      [getSysEnvOrAppEnv('ICC_TOKEN_HEADER_KEY', 'iccTokenHeaderKey')]: getSysEnvOrAppEnv('ICC_TOKEN', 'iccToken'),
    },
    pathRewrite: {
      [`^/${getSysEnvOrAppEnv('ICC_SERVER', 'iccServer')}`]: '', // `http://localhost:4200/ICC/very/deep/path` -> `http://example.com/very/deep/path`
    },
  });

  return config;
}
