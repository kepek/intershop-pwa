// tslint:disable: no-console ish-ordered-imports force-jsdoc-comments project-structure ban-specific-imports ish-no-object-literal-type-assertion ish-no-object-literal-type-assertion
import { Request } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

import { Environment } from '../environments/environment.model';
import { createProxiesConfig, RequestMethod } from './config';

const NODE_ENV = process.env.NODE_ENV;

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

    const { route, changeOrigin = true, logLevel = 'debug', secure = false, ...rest } = proxy;

    devProxy[`/${route}/**`] = {
      ...rest,
      changeOrigin,
      logLevel,
      secure,
    };
  });

  return devProxy;
}

/**
 * Create Proxy
 * @param env
 */
export function createProxy(env: Environment) {
  const config = createProxiesConfig(env);

  const { proxies } = config;

  const globalAllowedDomains = config?.allowedDomains || [];

  let prodProxies = [...proxies];

  if (process.env.NODE_ENV === 'production' && (process.env.PROXY_ICM || process.env.SSR_HYBRID)) {
    prodProxies = prodProxies.filter(p => p.route !== 'INTERSHOP');
  }

  return prodProxies.map(proxy => {
    const { route, changeOrigin = true, ...rest } = proxy;

    const allowedDomains = proxy?.allowedDomains || [];
    const allowedMethods = proxy?.allowedMethods || [];

    const filter = (pathname: string, req: Request) => {
      const checks = [];

      // Check if the request route is matching;
      checks.push(pathname.match(`^/${route}`)?.length > 0);

      // Check if the request method is allowed;
      checks.push(allowedMethods.map(v => v.toLowerCase()).includes(req.method.toLowerCase() as RequestMethod));

      // Check only in production environment;
      // Check if the request origin header value is one of the allowed domains;
      if (NODE_ENV === 'production' && req?.headers?.origin) {
        const isAllowedDomain = [...globalAllowedDomains, ...allowedDomains].includes(req.headers.origin);

        if (!isAllowedDomain) {
          console.log(`Your domain ${req.headers.origin} is not whitelisted.`);
        }

        checks.push(isAllowedDomain);
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
