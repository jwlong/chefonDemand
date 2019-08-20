import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'
class District extends BaseModel {
    constructor () {
        super('t_district', {
            district_code: {
                type: Sequelize.STRING(5),
                allowNull: false,
                primaryKey: true
            },
            district_name: {
                type: Sequelize.STRING(80),
                allowNull: false
            },
            city_code: {
                type: Sequelize.STRING(5),
                allowNull: true,
                references: {
                    model: 't_city',
                    key: 'city_code'
                }
            },
            province_code: {
                type: Sequelize.STRING(5),
                allowNull: true
            },
            country_code: {
                type: Sequelize.STRING(3),
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
            tableName: 't_district',
            timestamps: false
        });
        this.model = super.getModel();
     /*   this.model.belongsTo(town['model'],{foreignKey:'town_code'})
        this.model.belongsTo(city['model'],{foreignKey:'city_code'})*/
    }
}
module.exports = new District()