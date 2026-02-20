/**
 * Global E2E teardown — closes the app and DB connection
 * that were opened in globalSetup.
 */
export default async function globalTeardown(): Promise<void> {
  await global.__E2E_APP__?.close();
}
