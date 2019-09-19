import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
class OrderGuestList extends BaseModel {
    constructor() {
        super('t_order_guest_list', {
            order_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            order_guest_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            guest_name: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            email_address: {
                type: Sequelize.STRING(45),
                allowNull: true
            },
            contact_no: {
                type: Sequelize.STRING(8),
                allowNull: true
            },
            create_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            create_by: {
                type: Sequelize.INTEGER(11),
                allowNull: true
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
            tableName: 't_order_guest_list'
        });
    }
};
module.exports = new OrderGuestList();