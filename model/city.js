import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import province from './province'
import moment from 'moment'
class City extends BaseModel {
    constructor () {
        super('t_city', {
            City_Code: {
                type: Sequelize.STRING(5),
                allowNull: false,
                primaryKey: true
            },
            City_Name: {
                type: Sequelize.STRING(30),
                allowNull: true
            },
            Province_Code: {
                type: Sequelize.STRING(5),
                allowNull: true,
                references: {
                    model: 't_province',
                    key: 'Province_Code'
                }
            },
            Country_Code: {
                type: Sequelize.STRING(3),
                allowNull: false
            },
            Create_On: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                get() {
                    return moment(this.getDataValue('Create_On')).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            Create_By: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            Update_On: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                get() {
                    return moment(this.getDataValue('Update_On')).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            Update_By: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            Active_Ind: {
                type: Sequelize.STRING(1),
                allowNull: false
            }
        }, {
            tableName: 't_city',
            timestamps: false,
        });
        this.model = super.getModel();
    }
}
module.exports = new City()