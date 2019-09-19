import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
class MenuExtraCharge extends BaseModel {
    constructor() {
        super('t_menu_extra_charge', {
            menu_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 't_chef_menu',
                    key: 'menu_id'
                }
            },
            extra_charge_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            extra_charge_desc: {
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
            tableName: 't_menu_extra_charge',
            timestamps: false
        });
    }
};
module.exports = new MenuExtraCharge()
