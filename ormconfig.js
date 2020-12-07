module.exports = {
    "url": process.env.DATABASE_URL,
    "type": process.env.DATABASE_TYPE,
    "host": process.env.DATABASE_HOST,
    "port": process.env.DATABASE_PORT,
    "username": process.env.DATABASE_USERNAME,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "entities": [
        "dist/models/**/*.js"
    ],
    "migrations": [
        "dist/database/migrations/**/*.js"
    ],
    "cli": {
        "migrationsDir": [
            "./src/database/migrations"
        ],
        "entitiesDir": "scr/models"
    }
}