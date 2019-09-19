import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
class MenuInclude extends BaseModel {
    constructor() {
        super('t_menu_include', {
            menu_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 't_chef_menu',
                    key: 'menu_id'
                }
            },
            include_item_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 't_include_item',
                    key: 'include_item_id'
                }
            },
            qty: {
                type: Sequelize.INTEGER(5),
                allowNull: false
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
            },
            parent_menu_id: {
                type: Sequelize.INTEGER(11),
                allowNull: true
            }
        }, {
            tableName: 't_menu_include',
            timestamps:false
        });
    }
};
module.exports = new MenuInclude()
