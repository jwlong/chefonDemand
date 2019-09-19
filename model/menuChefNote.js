import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
class MenuChefNote extends BaseModel {
    constructor() {
        super('t_menu_chef_note', {
            menu_chef_note_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            menu_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 't_chef_menu',
                    key: 'menu_id'
                }
            },
            menu_chef_note: {
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
            tableName: 't_menu_chef_note',
            timestamps: false
        });
    }
};
module.exports = new MenuChefNote();