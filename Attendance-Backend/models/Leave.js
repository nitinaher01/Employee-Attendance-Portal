const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Employee = require('./Employee'); 

const Leave = sequelize.define('Leave', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'id'
        }
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        defaultValue: 'Pending' // Automatically sets to Pending when submitted
    }
}, {
    tableName: 'leaves',
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: false 
});

// Create the relationship
Employee.hasMany(Leave, { foreignKey: 'employee_id' });
Leave.belongsTo(Employee, { foreignKey: 'employee_id' });

module.exports = Leave;