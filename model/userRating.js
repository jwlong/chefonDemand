import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
class UserRating extends BaseModel {
    constructor() {
        super('t_user_rating', {
            rating_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 't_user',
                    key: 'user_id'
                }
            },
            order_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 't_order',
                    key: 'order_id'
                }
            },
            overall_rating: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            menu_quality: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            service_quality: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            mastery_flavour_cooking_techniques: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            personality_of_chef_in_cuisine: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            hygene: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            value_for_money: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            remarks_html: {
                type: Sequelize.STRING(4000),
                allowNull: true
            },
            create_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            create_by: {
                type: Sequelize.INTEGER(11),
                allowNull: true
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
        },  {
            tableName: 't_user_rating',
            timestamps:false
        });
    }
};
module.exports = new UserRating();