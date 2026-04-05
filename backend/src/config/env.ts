import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isDev: (process.env.NODE_ENV ?? 'development') !== 'production',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'default_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'default_refresh_secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  database: {
    url: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/fincoin',
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS ?? '12', 10),
  },
};
