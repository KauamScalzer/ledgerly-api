const { execSync } = require('child_process');

const name = process.argv[2];

if (!name) {
  console.error('Nome da migration é obrigatório');
  process.exit(1);
}

execSync(
  `npm run typeorm -- migration:generate src/database/migrations/${name}`,
  { stdio: 'inherit' }
);
