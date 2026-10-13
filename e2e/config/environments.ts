// Where the end-to-end tests run. Pick one with TEST_ENV=local|test|production (default: local).
// BASE_URL overrides the address for any environment.

export const environmentNames = ['local', 'test', 'production'] as const;
export type EnvironmentName = (typeof environmentNames)[number];

export interface Environment {
  readonly name: EnvironmentName;
  readonly baseURL: string;
  /** Playwright starts the app itself (production build + `vite preview`). */
  readonly startsLocalServer: boolean;
}

const LOCAL_PORT = 4173;

const defaults: Record<EnvironmentName, { baseURL: string | undefined; startsLocalServer: boolean }> = {
  local: { baseURL: `http://localhost:${LOCAL_PORT}`, startsLocalServer: true },
  // The lab dev server (see CLAUDE.md for how to start it).
  test: { baseURL: 'https://app-lab11126.labs.decoded.com', startsLocalServer: false },
  // There is no live service yet, so production needs BASE_URL.
  production: { baseURL: undefined, startsLocalServer: false },
};

function isEnvironmentName(value: string): value is EnvironmentName {
  return (environmentNames as readonly string[]).includes(value);
}

export function resolveEnvironment(env: NodeJS.ProcessEnv = process.env): Environment {
  const name = env.TEST_ENV ?? 'local';
  if (!isEnvironmentName(name)) {
    throw new Error(`TEST_ENV must be one of ${environmentNames.join(', ')}, not "${name}"`);
  }
  const baseURL = env.BASE_URL ?? defaults[name].baseURL;
  if (!baseURL) {
    throw new Error(`Set BASE_URL to run the tests against the ${name} environment`);
  }
  return { name, baseURL, startsLocalServer: defaults[name].startsLocalServer && !env.BASE_URL };
}

export const localServer = {
  command: `npm run build && npm run preview -- --port ${LOCAL_PORT} --strictPort`,
  url: `http://localhost:${LOCAL_PORT}`,
} as const;
