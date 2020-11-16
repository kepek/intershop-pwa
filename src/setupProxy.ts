// tslint:disable: no-console ish-ordered-imports force-jsdoc-comments project-structure ban-specific-imports

require('ts-node').register({
  project: './tsconfig.base.json',
});

const getProxyEnvironmentConfig = () => {
  try {
    return require('./environments/environment.proxy').environment;
  } catch (err) {
    console.error('The proxy environment config file does not exist.');
    console.error(err);
    process.exit(1);
  }
};

const environment = getProxyEnvironmentConfig();

const { createDevProxy } = require('./proxy');

const devProxy = createDevProxy(environment);

module.exports = devProxy;
