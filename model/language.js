import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'
class Language extends BaseModel {
    constructor () {
        super('t_language', {
            language_code: {
                type: Sequelize.STRING(5),
                allowNull: false,
                primaryKey: true
            },
            language_name: {
                type: Sequelize.STRING(50),
                allowNull: false
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
            tableName: 't_language',
            timestamps: false,
        });
        this.model = super.getModel()
        //this.model.sync()
    }
}
module.exports = new Language()