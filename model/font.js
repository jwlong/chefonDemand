import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'
class Font extends BaseModel {
    constructor () {
        super('t_font', {
            font_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            platform_code: {
                type: Sequelize.STRING(1),
                allowNull: false
            },
            platform: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            font_family: {
                type: Sequelize.STRING(100),
                allowNull: false
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
            tableName: 't_font'
        });
    }
};
module.exports = new Font()