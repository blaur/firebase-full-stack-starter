const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV;

const configData = fs.readFileSync(
  path.resolve(__dirname, `functions/src/config/${env}-config.ts`),
);

console.log(`inject config for '${env}'`);

fs.writeFileSync(path.resolve(__dirname, 'functions/src/config/config.ts'), configData);
