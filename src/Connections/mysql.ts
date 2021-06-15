import { Sequelize } from "sequelize";
import { DB } from '../Constants/DB_CONSTANTS';
import { getLogger } from "../Helpers/logger";

export class Mysql {
    private static sequelize: Sequelize;
    private static logger = getLogger('MYSQL_LOGGER')

    public static connect() {
        this.sequelize = new Sequelize(
            DB.name,
            DB.username,
            DB.password, {
            replication: {
                read: [{
                    host: DB.slaveHost,
                    port: DB.slavePort
                }],
                write: {
                    host: DB.host,
                    port: DB.port
                }
            },
            dialect: 'mysql',
            pool: {
                min: 2,
                max: 10
            },
            logging: msg => this.logger.debug(msg)
        });
        return this.sequelize;
    }

    /**
     * 
     * @returns 
     */
    public static getConnection() {
        return this.sequelize;
    }

    public static async healthCheck() {
        await this.getConnection().authenticate();
    }

    /**
     * Do not use this unless u are terminating the application
     */
    public static async closeConnection() {
        this.sequelize.close();
    }

}