import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
class Order extends BaseModel {
    constructor() {
        super('t_order', {
            order_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 't_user',
                    key: 'user_id'
                }
            },
            payment_ref_id: {
                type: Sequelize.STRING(36),
                allowNull: false,
            },
            city_code: {
                type: Sequelize.STRING(5),
                allowNull: false,
            },
            country_code: {
                type: Sequelize.STRING(3),
                allowNull: false,
            },
            pending_order_id: {
                type: Sequelize.INTEGER(11),
                allowNull: true,
                references: {
                    model: 't_order',
                    key: 'order_id'
                }
            },
            menu_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            event_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            num_of_guest: {
                type: Sequelize.INTEGER(11),
                allowNull: true
            },
            num_of_child: {
                type: Sequelize.INTEGER(11),
                allowNull: true
            },
            address_1: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            address_2: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            address_3: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            remarks: {
                type: Sequelize.STRING(4000),
                allowNull: true
            },
            order_status: {
                type: Sequelize.STRING(5),
                allowNull: true
            },
            start_datetime: {
                type: Sequelize.DATE,
                allowNull: true
            },
            end_datetime: {
                type: Sequelize.DATE,
                allowNull: true
            },
            promo_code: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            sub_total: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                defaultValue: '0.0000'
            },
            sales_tax_amt: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                defaultValue: '0.0000'
            },
            sales_tax_display: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            total: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                defaultValue: '0.0000'
            },
            payment_type: {
                type: Sequelize.STRING(1),
                allowNull: false
            },
            accept_kitchen_requirement_chef_note_ind: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: '0'
            },
            accept_terms_ind: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: '0'
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
            tableName: 't_order',
            timestamps: false
        });
    }
};
module.exports = new Order()
