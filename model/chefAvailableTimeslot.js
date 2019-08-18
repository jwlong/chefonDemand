import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import db from '../config/db.js'
import chef from './chef'
import moment from 'moment'
class ChefAvailableTimeslot extends BaseModel {
    constructor () {
        super('t_chef_available_timeslot', {
            timeslot_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            chef_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 't_chef',
                    key: 'chef_id'
                }
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            available_meal: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                defaultValue: '3'
            },
            instant_ind: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: '1'
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
            tableName: 't_chef_available_timeslot',
            timestamp:false
        });

        this.model = super.getModel();
        this.model.belongsTo(chef['model'],{foreignKey:'chef_id'})
    }
}
module.exports = new ChefAvailableTimeslot()