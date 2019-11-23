import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
class MenuSection extends BaseModel {
    constructor() {
        super('t_menu_section', {
            chef_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 't_chef',
                    key: 'chef_id'
                }
            },
            menu_section_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            menu_section_name: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            menu_section_desc: {
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
            tableName: 't_menu_section',
            timestamps: false
        });
    }
};
module.exports = new MenuSection()
