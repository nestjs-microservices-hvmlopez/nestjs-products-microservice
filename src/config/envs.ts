import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  HOST: string;
  NATS_SERVERS: string[];
}

const envSchema = joi
  .object({
    PORT: joi.number().default(3000),
    DATABASE_URL: joi.string().required(),
    HOST: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS
    ? process.env.NATS_SERVERS.split(',')
    : ['nats://localhost:4222'],
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  HOST: envVars.HOST,
  DATABASE_URL: envVars.DATABASE_URL,
  NATS_SERVERS: process.env.NATS_SERVERS
    ? process.env.NATS_SERVERS.split(',')
    : ['nats://localhost:4222'],
};
