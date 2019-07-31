import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import city from './city'
import moment from 'moment'
class District extends BaseModel {
    constructor () {
        super('t_district', {
            District_Code: {
                type: Sequelize.STRING(5),
                allowNull: false,
                primaryKey: true
            },
            District_Name: {
                type: Sequelize.STRING(80),
                allowNull: false
            },
            City_Code: {
                type: Sequelize.STRING(5),
                allowNull: true,
                references: {
                    model: 't_city',
                    key: 'City_Code'
                }
            },
            Province_Code: {
                type: Sequelize.STRING(5),
                allowNull: true
            },
            Country_Code: {
                type: Sequelize.STRING(3),
                allowNull: true
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
            tableName: 't_district',
            timestamps: false,
        });
        this.model = super.getModel();
     /*   this.model.belongsTo(town['model'],{foreignKey:'town_code'})
        this.model.belongsTo(city['model'],{foreignKey:'city_code'})*/
    }
}
module.exports = new District()