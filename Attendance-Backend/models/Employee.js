const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'employees',
    timestamps: true, // This automatically handles the created_at column
    createdAt: 'created_at',
    updatedAt: false // We didn't make an updated_at column in SQL, so we turn this off
});

module.exports = Employee;