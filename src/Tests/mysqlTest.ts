import { init } from "./init";
init(); // To set all env

import { expect } from 'chai';
import { Mysql } from "../Connections/mysql";

describe('Test suite for mysql', () => {
    it('should be create and check connection', async () => {
        Mysql.connect();
        await Mysql.healthCheck();
    }).timeout(10000);

    after(() => {
        Mysql.closeConnection();
    })
})