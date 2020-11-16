const force = process.argv.length > 2 && process.argv[2] === '-f';

if (process.env.CI && !force) {
  console.log('skipping creation of environment.local.ts & environment.proxy.ts');
  process.exit(0);
}

const environmentLocalPath = 'src/environments/environment.local.ts';
const environmentLocalDataSource = `import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,
  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: 'https://intershoppwa.azurewebsites.net',
  icmChannel: 'inSPIRED-inTRONICS_Business-Site',
  icmApplication: '-',
  /* ICC API CONFIGURATION */
  iccToken: 'YOUR_ICC_API_TOKEN',
};

`;

const environmentProxyPath = 'src/environments/environment.proxy.ts';
const environmentProxyDataSource = `import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

interface EnvironmentProxy extends Environment {
  /* PROXY CONFIGURATION */
  icmProxyURL: string;
}

export const environment: EnvironmentProxy = {
  ...ENVIRONMENT_DEFAULTS,
  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: 'http://localhost:4200',
  /* PROXY CONFIGURATION */
  icmProxyURL: 'https://intershoppwa.azurewebsites.net',
  /* ICC API CONFIGURATION */
  iccToken: 'YOUR_ICC_API_TOKEN',
};

`;

const environmentPaths = [
  {
    path: environmentLocalPath,
    data: environmentLocalDataSource,
  },
  {
    path: environmentProxyPath,
    data: environmentProxyDataSource,
  },
];

const fs = require('fs');

environmentPaths.forEach(env => {
  if (!fs.existsSync(env.path) || force) {
    if (fs.existsSync(env.path)) {
      const backupPath = env.path + '.bak';
      console.log('BACKUP ' + backupPath);
      fs.renameSync(env.path, backupPath);
    }

    console.log('CREATE ' + env.path);

    fs.writeFileSync(env.path, env.data);
  }
});
