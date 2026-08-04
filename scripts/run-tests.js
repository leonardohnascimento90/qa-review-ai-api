const { spawn } = require('child_process');
const path = require('path');

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(command, ['mocha', '--exit', 'tests/**/*.test.js'], {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => process.exit(code || 0));
