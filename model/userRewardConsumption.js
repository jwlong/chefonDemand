import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
class UserRewardConsumption extends BaseModel {
    constructor() {
        super('t_user_reward_consumption', {
            reward_consume_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 't_user',
                    key: 'user_id'
                }
            },
            order_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 't_order',
                    key: 'order_id'
                }
            },
            redeemed_total_price: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            reward_points_consumed: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            expire_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
        }, {
            tableName: 't_user_reward_consumption',
            timestamps:false
        });
    }
};
module.exports = new UserRewardConsumption();
