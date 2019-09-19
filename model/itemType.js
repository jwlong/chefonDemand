import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'

class ItemType extends BaseModel {
    constructor() {
        super('t_item_type', {
            item_type_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            item_type_name: {
                type: Sequelize.STRING(100),
                allowNull: true,
                unique: true
            },
            item_type_desc: {
                type: Sequelize.STRING(100),
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
            tableName: 't_item_type',
            timestamps: false
        });
    }
};
module.exports = new ItemType();