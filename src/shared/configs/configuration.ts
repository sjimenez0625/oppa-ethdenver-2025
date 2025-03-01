export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
  },
  redis: {
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
    namespace: process.env.REDIS_NAMESPACE,
  },
  icp: {
    host: process.env.ICP_LEDGER_HOST,
    env: process.env.ICP_LEDGER_ENV,
    port: process.env.ICP_LEDGER_PORT,
    canisterId: process.env.ICP_LEDGER_CANISTER_ID
  }
});
