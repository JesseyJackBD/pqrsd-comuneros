import { createPool } from "mysql2/promise";

import {DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD} from './config.js'

const pool = createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE 
});

export default pool; 