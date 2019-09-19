/* jshint indent: 2 */
import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
class OrderItemOption extends BaseModel {
    constructor() {
        super('t_order_item_option', {
            order_item_option_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            order_item_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 't_order_item',
                    key: 'order_item_id'
                }
            },
            seq_no: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            opt_txt: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            opt_desc: {
                type: Sequelize.STRING(1000),
                allowNull: true
            },
            unit_price: {
                type: Sequelize.DECIMAL,
                allowNull: true
            },
            currency_code: {
                type: Sequelize.STRING(3),
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
            tableName: 't_order_item_option',
            timestamps: false
        });
    }
};
module.exports = new OrderItemOption()
