// tslint:disable: no-console ish-ordered-imports force-jsdoc-comments project-structure ban-specific-imports
import { Options } from 'http-proxy-middleware';
import { Environment } from '../environments/environment.model';
import * as https from 'https';
import * as http from 'http';

// TODO (extMlk): Talk with DevOps to change the name of the `PROXY_ICC` to `ICC_PROXY_URL` to remove below workaround.
if (!process.env.ICC_PROXY_URL && process.env.PROXY_ICC) {
  process.env.ICC_PROXY_URL = process.env.PROXY_ICC;
}

const PORT = process.env.PORT || 4200;

export interface Proxy extends Options {
  route: string;
  allowedMethods: RequestMethod[];
  allowedDomains?: string[];
}

export interface Config {
  allowedDomains: string[];
  proxies: Proxy[];
}

export type RequestMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

/**
 * Get and detect the httpAgent.
 * @param url
 */
export function getHttpAgent(url) {
  const httpProtocol = new URL(url).protocol.slice(0, -1);
  return httpProtocol === 'https' ? new https.Agent({ rejectUnauthorized: false }) : new http.Agent();
}

export const defaultAllowedDomains = [
  ...new Set([
    `${process.env.SSL ? 'https://' : 'http://'}${require('os').hostname().toLowerCase()}:${PORT}`,
    `${process.env.SSL ? 'https://' : 'http://'}localhost:${PORT}`,
  ]),
];

export const defaultAllowedMethods: RequestMethod[] = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'TRACE',
  'PATCH',
];

export const defaultHeaders: { [header: string]: string } = {};

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
