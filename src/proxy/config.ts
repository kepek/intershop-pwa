// tslint:disable: no-console ish-ordered-imports force-jsdoc-comments project-structure ban-specific-imports
import { Options } from 'http-proxy-middleware';

import { EnvironmentProxy } from '../environments/environment.proxy';
import { defaultAllowedDomains, defaultAllowedMethods, defaultHeaders, getHttpAgent, RequestMethod } from './index';

const NODE_ENV = process.env.NODE_ENV;

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
export function createProxiesConfig(env: EnvironmentProxy): Config {
  function getSysEnvOrAppEnv(sysEnvKey: string, appEnvKey: string): string {
    const sysEnvVar = process && process.env[sysEnvKey];
    const appEnvVar = env[appEnvKey];
    return sysEnvVar && sysEnvVar.length ? sysEnvVar : appEnvVar;
  }

  const config: Config = {
    allowedDomains: ['http://example.com', ...defaultAllowedDomains],
    proxies: [],
  };

  if (!NODE_ENV || NODE_ENV === 'development') {
    // Route -> /INTERSHOP/*
    const ICM_TARGET = getSysEnvOrAppEnv('PROXY_ICM', 'icmProxyURL') || getSysEnvOrAppEnv('ICM_BASE_URL', 'icmBaseURL');

    config.proxies.push({
      route: getSysEnvOrAppEnv('ICM_SERVER', 'icmServer').split('/')[0],
      target: ICM_TARGET,
      allowedMethods: defaultAllowedMethods,
      agent: getHttpAgent(ICM_TARGET),
      headers: {
        ...defaultHeaders,
      },
    });
  }

  // Route -> /ICC/*
  const ICC_TARGET = getSysEnvOrAppEnv('PROXY_ICC', 'iccBaseURL');

  config.proxies.push({
    route: getSysEnvOrAppEnv('PROXY_ICC_SERVER', 'iccServer'),
    target: ICC_TARGET,
    allowedMethods: defaultAllowedMethods,
    agent: getHttpAgent(ICC_TARGET),
    headers: {
      ...defaultHeaders,
      [getSysEnvOrAppEnv('ICC_TOKEN_HEADER_KEY', 'iccTokenHeaderKey')]: getSysEnvOrAppEnv('ICC_TOKEN', 'iccToken'),
    },
    pathRewrite: {
      [`^/${getSysEnvOrAppEnv('PROXY_ICC_SERVER', 'iccServer')}`]: '', // `http://localhost:4200/ICC/very/deep/path` -> `http://example.com/very/deep/path`
    },
  });

  return config;
}
