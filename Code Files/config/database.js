const mysql = require('mysql2/promise');
const { Env } = require('./constant');

// Create a connection pool to the MySQL database
class SqlConnection {
    constructor() {
        this.pool = mysql.createPool({
            host: Env.DATABASE.host, // MySQL host
            user: Env.DATABASE.username, // MySQL user
            password: Env.DATABASE.password, // MySQL password
            database: Env.DATABASE.name, // Database name
            waitForConnections: true, // Wait for connections
            connectionLimit: 10, // Connection limit
            queueLimit: 0, // Queue limit
        })
    }

    query(...parameters) {
        return this.pool.query(...parameters)
    }
}

const mySqlConnection = new SqlConnection()

module.exports = mySqlConnection