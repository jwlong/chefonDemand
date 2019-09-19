import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
class MenuBookingRequirement extends BaseModel {
    constructor() {
        super('t_menu_booking_requirement', {
            menu_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 't_chef_menu',
                    key: 'menu_id'
                }
            },
            booking_requirement_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            booking_requirement_desc: {
                type: Sequelize.STRING(1000),
                allowNull: true
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
            tableName: 't_menu_booking_requirement',
            timestamps: false
        });
    }
};
module.exports = new MenuBookingRequirement();