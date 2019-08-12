import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'
class AccessToken extends BaseModel {
    constructor () {
        super('t_access_token', {
            token_id: {
                type: Sequelize.INTEGER(11),
                primaryKey:true,
                allowNull: false,
                autoIncrement:true
            },
            user_id: {
                type: Sequelize.INTEGER(11),
                allowNull: true
            },
            token_string: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            valid_until: {
                type: Sequelize.DATE,
                allowNull: true
            },
            ipv4_address: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            for_order: {
                type: Sequelize.BOOLEAN,
                allowNull: true
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
            }
        }, {
            tableName: 't_access_token',
            timestamps: false,
        });
        this.model = super.getModel()
    }
}
module.exports = new AccessToken()