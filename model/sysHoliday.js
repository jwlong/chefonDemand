import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
class SysHoliday extends BaseModel {
    constructor() {
        super('t_sys_holiday', {
            holiday_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            holiday_name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            holiday_desc: {
                type: Sequelize.STRING(1000),
                allowNull: true
            },
            holiday_date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            country_code: {
                type: Sequelize.STRING(3),
                allowNull: false,
                references: {
                    model: 't_country',
                    key: 'country_code'
                }
            },
            create_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            create_by: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            update_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            update_by: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            active_ind: {
                type: Sequelize.STRING(1),
                allowNull: false
            }
        }, {
            tableName: 't_sys_holiday',
            timestamps: false
        });
    }
};

module.exports = new SysHoliday();