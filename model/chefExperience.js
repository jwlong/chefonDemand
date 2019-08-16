import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'

class ChefExperience extends BaseModel {
    constructor() {
        super('t_chef_experience', {
            exp_id: {
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
            exp_desc: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            end_date: {
                type: Sequelize.DATEONLY,
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
            tableName: 't_chef_experience',
            timestamp:false
        });
        this.model = super.getModel();
    };
}
module.exports= new ChefExperience();