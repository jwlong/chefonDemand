import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
class MenuItem extends BaseModel {
    constructor() {
        super('t_menu_item', {
            menu_item_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            menu_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 't_chef_menu',
                    key: 'menu_id'
                }
            },
            seq_no: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            item_type_id: {
                type: Sequelize.INTEGER(11),
                allowNull: true
            },
            menu_item_name: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            menu_item_font_id: {
                type: Sequelize.INTEGER(11),
                allowNull: true
            },
            menu_item_font_size: {
                type: Sequelize.INTEGER(2),
                allowNull: true
            },
            menu_item_font_style_code: {
                type: Sequelize.STRING(10),
                allowNull: true
            },
            menu_item_desc: {
                type: Sequelize.STRING(1000),
                allowNull: true
            },
            menu_item_desc_font_id: {
                type: Sequelize.INTEGER(11),
                allowNull: true
            },
            menu_item_desc_font_size: {
                type: Sequelize.INTEGER(2),
                allowNull: true
            },
            menu_item_desc_font_style_code: {
                type: Sequelize.STRING(10),
                allowNull: true
            },
            max_choice: {
                type: Sequelize.INTEGER(5),
                allowNull: false,
                defaultValue: '1'
            },
            note: {
                type: Sequelize.STRING(2000),
                allowNull: true
            },
            optional: {
                type: Sequelize.BOOLEAN,
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
            tableName: 't_menu_item',
            timestamps:false
        });
    }
};
module.exports = new MenuItem();
