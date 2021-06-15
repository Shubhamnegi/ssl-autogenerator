export const DB = {
    name: process.env.DB_NAME as string,
    host: process.env.DB_HOST as string,
    port: Number.parseInt(process.env.DB_PORT as string),
    slaveHost: process.env.DB_SALVE_HOST as string,
    slavePort: Number.parseInt(process.env.DB_SALVE_PORT as string),
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
}