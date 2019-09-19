import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'

class IncludeItem extends BaseModel {
    constructor() {
        super('t_include_item', {
            include_item_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            item_name: {
                type: Sequelize.STRING(100),
                allowNull: true,
                unique: true
            },
            item_desc: {
                type: Sequelize.STRING(4000),
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
            tableName: 't_include_item'
            timestamps: false
        });
    }
};
module.exports = new IncludeItem();