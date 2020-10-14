const force = process.argv.length > 2 && process.argv[2] === '-f';

if (process.env.CI && !force) {
  console.log('skipping creation of environment.local.ts');
  process.exit(0);
}

const environmentLocalPath = 'src/environments/environment.local.ts';

const fs = require('fs');

if (!fs.existsSync(environmentLocalPath) || force) {
  if (fs.existsSync(environmentLocalPath)) {
    const environmentLocalBackupPath = environmentLocalPath + '.bak';
    console.log('creating backup ' + environmentLocalBackupPath);
    fs.renameSync(environmentLocalPath, environmentLocalBackupPath);
  }

  console.log('writing ' + environmentLocalPath);

  fs.writeFileSync(
    environmentLocalPath,
    `import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

    export const environment: Environment = {
      ...ENVIRONMENT_DEFAULTS,
      /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
      icmBaseURL: 'https://camfil.local',
    };

`
  );
}
