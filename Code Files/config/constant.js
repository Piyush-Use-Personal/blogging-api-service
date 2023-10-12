const dotenv = require('dotenv')
dotenv.config()

const Env = {
    DATABASE: {
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
    }
}

module.exports = {
    Env
}