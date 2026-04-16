const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize using the URL from .env file
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // This is required for cloud databases like Neon
        }
    },
    logging: false // Set to console.log if you want to see the raw SQL queries
});

module.exports = sequelize;