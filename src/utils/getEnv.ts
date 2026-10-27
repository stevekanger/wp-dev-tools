import { config } from 'dotenv';

config({ quiet: true });

/**
 * Gets env variables.
 *
 * @param val The value to retrieve.
 * @param fallback The value to use if the env variable is not set.
 */
export default function getEnv(val: string, fallback?: string): string {
  const envVar = process.env[val] ?? fallback;

  if (envVar === undefined) {
    throw new Error(`${val} not set in .env. No fallback provided.`);
  }

  return envVar;
}
