import { waitForPortOpen } from '@nx/node/utils';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;
var __BACKEND_PID__: number | undefined;

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  const backendEntrypointPath = join(process.cwd(), 'apps/back-end/dist/main.js');

  if (!existsSync(backendEntrypointPath)) {
    throw new Error(
      `Back-end build output not found at ${backendEntrypointPath}. Run @teddy-open-finance/back-end:build before e2e.`,
    );
  }

  const backendProcess = spawn('node', [backendEntrypointPath], {
    detached: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      HOST: host,
      PORT: String(port),
    },
  });
  backendProcess.unref();
  globalThis.__BACKEND_PID__ = backendProcess.pid;

  await waitForPortOpen(port, { host });

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};
