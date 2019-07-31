import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'
class ChefServiceLocation extends BaseModel {
    constructor () {
        super('t_chef_service_location', {
            chef: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 't_chef',
                    key: 'chef_id'
                }
            },
            district: {
                type: Sequelize.STRING(5),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 't_district',
                    key: 'District_Code'
                }
            },
            Create_On: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
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
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
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
            tableName: 't_chef_service_location',
            timestamps: false,
        });
        this.model = super.getModel();
    }
}
module.exports = new ChefServiceLocation()