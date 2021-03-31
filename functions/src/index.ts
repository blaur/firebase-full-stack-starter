import { config } from './config/config';

// initiate config. Important to run import app even though not used. It initiates firebase!
import * as admin from 'firebase-admin';

// Configuration constants and admin init
const creds: any = config.credential;
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(creds);
admin.initializeApp(adminConfig);

// fix paths
const tsConfig = require('../tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');
tsConfigPaths.register({
  baseUrl: __dirname,
  paths: tsConfig.compilerOptions.paths,
});

// The one app domain
export * from './apps/firebase-full-stack-starter';
