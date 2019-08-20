import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'
class Country extends BaseModel {
    constructor () {
        super('t_country', {
            country_code: {
                type: Sequelize.STRING(3),
                allowNull: false,
                primaryKey: true
            },
            country_name: {
                type: Sequelize.STRING(50),
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
            tableName: 't_country',
            timestamps: false
        });
        this.model = super.getModel();
    }
}
module.exports = new Country()