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
            create_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                get() {
                    return moment(this.getDataValue('Create_On')).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            create_by: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            update_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                get() {
                    return moment(this.getDataValue('Update_On')).format('DD/MM/YYYY HH:mm:ss');
                }
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
            tableName: 't_chef_service_location',
            timestamps: false,
        });
        this.model = super.getModel();
    }
}
module.exports = new ChefServiceLocation()