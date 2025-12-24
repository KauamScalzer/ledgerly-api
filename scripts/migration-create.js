const { execSync } = require('child_process');

const name = process.argv[2];

if (!name) {
  process.exit(1);
}

execSync(
  `npm run typeorm -- migration:create src/database/migrations/${name}`,
  { stdio: 'inherit' }
);