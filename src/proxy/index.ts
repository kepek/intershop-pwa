// tslint:disable: no-console ish-ordered-imports force-jsdoc-comments project-structure ban-specific-imports ish-no-object-literal-type-assertion ish-no-object-literal-type-assertion
import * as https from 'https';
import * as http from 'http';
import { Request } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

import { Environment } from '../environments/environment.model';
import { createProxiesConfig } from './config';

const PORT = process.env.PORT || 4200;

const NODE_ENV = process.env.NODE_ENV;

export type RequestMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

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

export const defaultHeaders: { [header: string]: string } = {
  'content-type': 'application/json',
};

/**
 * Get and detect the httpAgent.
 * @param url
 */
export function getHttpAgent(url) {
  const httpProtocol = new URL(url).protocol.slice(0, -1);
  return httpProtocol === 'https' ? new https.Agent({ rejectUnauthorized: false }) : new http.Agent();
}

/**
 * Create Development Proxy
 * @param env
 */
export function createDevProxy(env: Environment) {
  const config = createProxiesConfig(env);

  const devProxy = {};

  const { proxies } = config;

  proxies.forEach(proxy => {
    delete proxy.allowedDomains;
    delete proxy.allowedMethods;

    const { route, changeOrigin = true, logLevel = 'debug', secure = true, ...rest } = proxy;

    const middlewareConfig: Options = {
      ...rest,
      changeOrigin,
      logLevel,
      secure,
    };

    devProxy[`/${route}/*`] = middlewareConfig;
  });

  return devProxy;
}

/**
 * Create Proxy
 * @param env
 */
export function createProxy(env: Environment) {
  const config = createProxiesConfig(env);

  const { allowedDomains: globalAllowedDomains = [], proxies } = config;

  let prodProxies = [...proxies];

  if (process.env.NODE_ENV === 'production' && (process.env.PROXY_ICM || process.env.SSR_HYBRID)) {
    prodProxies = prodProxies.filter(p => p.route !== 'INTERSHOP');
  }

  return prodProxies.map(proxy => {
    const { route, allowedDomains = [], allowedMethods = ['GET'], changeOrigin = true, ...rest } = proxy;

    const filter = (pathname: string, req: Request) => {
      const checks = [];

      // Check if the request route is matching;
      checks.push(pathname.match(`^/${route}`)?.length > 0);

      // Check if the request method is allowed;
      checks.push(allowedMethods.map(v => v.toLowerCase()).includes(req.method.toLowerCase() as RequestMethod));

      // Check only in production environment;
      // Check if the request origin header value is one of the allowed domains;
      if (NODE_ENV === 'production' && req?.headers?.origin) {
        checks.push([...globalAllowedDomains, ...allowedDomains].includes(req.headers.origin));
      }

      return checks.every(check => check === true);
    };

    console.log(`making "${proxy.target}" available for all requests via '/${route}'`);

    const middlewareConfig: Options = {
      ...rest,
      changeOrigin,
      logLevel: NODE_ENV === 'development' ? 'debug' : 'info',
    };

    return createProxyMiddleware(filter, middlewareConfig);
  });
}
