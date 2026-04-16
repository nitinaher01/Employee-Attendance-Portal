const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Employee = require('./Employee'); // Import the Employee model

const Attendance = sequelize.define('Attendance', {
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
    date: {
        type: DataTypes.DATEONLY, // Just the date (YYYY-MM-DD)
        allowNull: false
    },
    check_in_time: {
        type: DataTypes.DATE, // Date and Time
        allowNull: false
    },
    check_out_time: {
        type: DataTypes.DATE // Date and Time
    },
    total_hours: {
        type: DataTypes.DECIMAL(5, 2)
    }
}, {
    tableName: 'attendance',
    timestamps: false // We are managing dates manually
});

// Create the relationship (One Employee has many Attendance records)
Employee.hasMany(Attendance, { foreignKey: 'employee_id' });
Attendance.belongsTo(Employee, { foreignKey: 'employee_id' });

module.exports = Attendance;