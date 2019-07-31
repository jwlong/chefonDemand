import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'
class Language extends BaseModel {
    constructor () {
        super('t_language', {
            Language_Code: {
                type: Sequelize.STRING(5),
                allowNull: false,
                primaryKey: true
            },
            Language_Name: {
                type: Sequelize.STRING(50),
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
            tableName: 't_language',
            timestamps: false,
        });
        this.model = super.getModel()
        //this.model.sync()
    }
}
module.exports = new Language()