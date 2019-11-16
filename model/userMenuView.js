import Sequelize from 'Sequelize'
import BaseModel from './baseModel.js'
class UserWishList extends BaseModel {
    constructor() {
        super('t_user_menu_view', {
            view_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 't_user',
                    key: 'user_id'
                }
            },
            menu_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                references: {
                    model: 't_chef_menu',
                    key: 'menu_id'
                }
            },
            viewed_on: {
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
            tableName: 't_user_menu_view',
            timestamps: false
        });
    };
}
module.exports = new UserWishList();
