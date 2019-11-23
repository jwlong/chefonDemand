import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'
class FoodItem extends BaseModel {
    constructor () {
        super('t_food_item', {
            chef_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 't_chef',
                    key: 'chef_id'
                }
            },
            food_item_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            food_item_name: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            food_item_desc: {
                type: Sequelize.STRING(1000),
                allowNull: true
            },
            photo_url: {
                type: Sequelize.STRING(1000),
                allowNull: false
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
            tableName: 't_food_item',
            timestamps:false
        });
    }
};
module.exports = new FoodItem();