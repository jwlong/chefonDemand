import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'
class CuisineType extends BaseModel {
    constructor () {
        super('t_cuisine_type', {
            cuisine_type_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            cuisine_type_name: {
                type: Sequelize.STRING(30),
                allowNull: false
            },
            Description: {
                type: Sequelize.STRING(4000),
                allowNull: false
            },
            orgin_country: {
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
            tableName: 't_cuisine_type',
            timestamps: false,
        });
        this.model = super.getModel();
    }
}
module.exports = new CuisineType()